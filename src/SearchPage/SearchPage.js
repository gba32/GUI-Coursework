import { Button, TextField, ThemeProvider, Typography } from "@mui/material";
import { Link, useNavigate, useNavigation } from "react-router";
import { APP_THEME } from "../Theme/Theme";
import { WeatherInfo } from "../WeatherPage/WeatherPage";
import { API_KEY } from "../KEY_PROVIDER";
import NavigationBar from "../NavigationBar/NavigationBar";
import ListCard from "../ListCard/ListCard";
import { useState } from "react";
import { reset as resetKey, writeOnce } from "../StorageManager/StorageManager";

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
        resetKey("location");
        writeOnce("location", JSON.stringify(data));
        navigator("/weather");
    };
    let [searchResults, setSearchResults] = useState([]);
    const apiKey = API_KEY;
    
    let textChangeHandler = (event) => {
        WeatherInfo
            .fetchLocationData(apiKey, event.target.value, 20)
            .then((results) => {
                setSearchResults(results);
            });
    }


    return (
        <ThemeProvider theme={APP_THEME}>
            <NavigationBar title="Location search"/>
            <TextField onChange={textChangeHandler}></TextField>
            <ListCard title="Results" expanded childPropsList={searchResults} childTemplate={(params) => LocationCard(params, clickHandler)}/>

        </ThemeProvider>
    )


}