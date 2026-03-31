import { TextField, ThemeProvider, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { APP_THEME } from "../Theme/Theme";
import { WeatherUtil } from "../Utility/WeatherUtil";
import { API_KEY } from "../KEY_PROVIDER";
import NavigationBar from "../NavigationBar/NavigationBar";
import ListCard from "../ListCard/ListCard";
import { useState } from "react";
import StorageUtil  from "../Utility/StorageUtil";

function LocationCard(data, onClick) {
    return <a href="" onClick={() => onClick(data)}>
        <div>
            <Typography variant="h5">{data["name"]}</Typography>
            <Typography variant="h6">{data["country"]}</Typography>
            <Typography variant="h6">{data["state"]}</Typography>
        </div>
    </a>
}

export default function SearchPage() {
    let navigator = useNavigate();
    let clickHandler = (data) => {
        StorageUtil.reset("location");
        StorageUtil.writeOnce("location", JSON.stringify(data));
        navigator("/weather");
    };
    let [searchResults, setSearchResults] = useState([]);
    const apiKey = API_KEY;
    
    let textChangeHandler = (event) => {
        WeatherUtil
            .fetchLocationData(apiKey, event.target.value, 20)
            .then((results) => {
                console.log(results);
                setSearchResults(results.status == 200 ? results.response : []);
            });
    }


    return (
        <ThemeProvider theme={APP_THEME}>
            <TextField onChange={textChangeHandler}></TextField>
            <ListCard title="Results" expanded childPropsList={searchResults} childTemplate={(params) => LocationCard(params, clickHandler)}/>

        </ThemeProvider>
    )


}