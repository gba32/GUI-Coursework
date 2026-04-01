import { Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import { API_KEY } from "../KEY_PROVIDER";
import ListCard from "../ListCard/ListCard";
import TitleBar from "../NavigationBar/NavigationBar";
import StorageUtil from "../Utility/StorageUtil";
import { WeatherUtil } from "../Utility/WeatherUtil";
import "./SearchPage.css";

/**
 * Card template for location results
 * 
 * @param {*} data geocoding data for a given location
 * @param {*} onClick a callback function to perform when the card is pressed
 * @returns 
 */
function LocationCard(data, onClick) {
    return <article className="searchResult">
        <Button variant="contained" href="" onClick={() => onClick(data)}>
            <div>
                <Typography variant="h5">{data["name"]}</Typography>
                <Typography variant="p" component="div">{data["country"]}</Typography>
                <Typography variant="p" component="div">{data["state"]}</Typography>
            </div>
        </Button>
    </article>
}

/**
 * A location search page which redirects to the weather page.
 */
export default function SearchPage() {
    const apiKey = API_KEY;
    const RESULT_LIMIT = 20;
    let navigator = useNavigate();
    let clickHandler = (data) => {
        StorageUtil.reset("location");
        StorageUtil.writeOnce("location", JSON.stringify(data));
        navigator("/weather");
    };
    let [searchResults, setSearchResults] = useState([]);

    // Fetch geocoding data
    let textChangeHandler = (event) => {
        WeatherUtil
            .fetchLocationData(apiKey, event.target.value, RESULT_LIMIT)
            .then((results) => {
                setSearchResults(results.status === 200 ? results.response : []);
            });
    }


    return (
        <section className="searchContainer">
            <TitleBar title="Locations" />
            <TextField placeholder="Search for location" onChange={textChangeHandler}></TextField>
            <ListCard title="Results" showTitle  expanded childPropsList={searchResults} childTemplate={(params) => LocationCard(params, clickHandler)} />
        </section>
    )


}