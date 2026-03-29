import { Box, ThemeProvider, Typography } from "@mui/material";
import ListCard from "../ListCard/ListCard";
import NavigationBar from "../NavigationBar/NavigationBar";
import "./WeatherPage.css"
import { APP_THEME } from "../Theme/Theme";
import { useEffect, useRef, useState } from "react";
import { API_KEY } from "../KEY_PROVIDER";
import { useLocation, useNavigate, useParams } from "react-router";
import { read as readValue, writeOnce } from "../StorageManager/StorageManager";

export class WeatherInfo {
    constructor(weatherJSON) {
    }

    static fetchJSON(url, params) {
        return fetch(url + "?" + new URLSearchParams(params), { method: "GET" }).then(response => response.json());
    }

    static fetchForecast3Hour(apiKey, longitude, latitude) {
        return this.fetchJSON("http://api.openweathermap.org/data/2.5/forecast", { lat: latitude, lon: longitude, appid: apiKey });
    }

    static fetchForecast1Hour(apiKey, longitude, latitude, count) {
        return this.fetchJSON("https://pro.openweathermap.org/data/2.5/forecast/hourly", { lat: latitude, lon: longitude, appid: apiKey, cnt: count })
    }

    // static fetchCurrentDateWeather(apiKey, longitude, latitude) {    
    //     return this.fetchJSON("https://api.openweathermap.org/data/2.5/weather", {lat: latitude, lon: longitude});
    // }

    static fetchLocationData(apiKey, cityName, limit) {
        return this.fetchJSON("http://api.openweathermap.org/geo/1.0/direct", { q: cityName, limit: limit, appid: apiKey });
    }


    static kelvinToCelcius(kelvin) {
        return kelvin - 272.15;
    }

    static kelvinToFarenheit(kelvin) {
        return WeatherInfo.kelvinToCelcius(kelvin) * 1.8 + 32.
    }

    static parseKelvin(kelvin, converter) {
        return Math.trunc(converter(parseFloat(kelvin)));
    }

    static getIconURL(iconId) {
        return "https://openweathermap.org/img/wn/" + iconId + ".png";
    }

}

function updateLocation(newLocation) {
    if(sessionStorage.getItem("locationSet") !== true) {
        sessionStorage.setItem("locationSet", true);
        sessionStorage.setItem("location", )
    }
}

export default function WeatherPage({ route }) {
    let [currentWeatherJSON, setCurrentWeather] = useState({ data: {}, loaded: false });
    let [dailyWeatherJSON, setDailyWeather] = useState({ data: {}, loaded: false });
    const apiKey = API_KEY;
    let locationData = JSON.parse(readValue("location"));
    let navigator = useNavigate();

    useEffect(() => {
        WeatherInfo.fetchForecast3Hour(apiKey, locationData["lon"], locationData["lat"]).then(result => {
            setDailyWeather({ data: result["list"], loaded: true });
        });

        WeatherInfo.fetchForecast1Hour(apiKey, locationData["lon"], locationData["lat"], 6).then(result => {
            setCurrentWeather({data: result["list"], loaded: true});
        })
    }, [])

    return (
        <ThemeProvider theme={APP_THEME}>
            <main>
                <NavigationBar onBackPressed={() => navigator(-1)} showBackButton title={locationData["name"]}></NavigationBar>
                <CurrentWeatherCard json={currentWeatherJSON.data[0]} enabled={currentWeatherJSON.loaded} />
                {/* <WeatherForecastCard json={dailyWeatherJSON.data} enabled={dailyWeatherJSON.loaded} /> */}
                <WeatherPreview json={currentWeatherJSON.data} enabled={currentWeatherJSON.loaded}/>
            </main>

        </ThemeProvider>
    );
}

function CurrentWeatherCard({ json, enabled }) {
    if (enabled) {
        const mainJSON = json["main"];
        const weatherJSON = json["weather"][0];
        console.log("MAIN", mainJSON);
        return <section className="currentWeatherCard">
            <Typography variant="h1">{
                WeatherInfo.parseKelvin(mainJSON["temp"], WeatherInfo.kelvinToCelcius)
            }°</Typography>
            <Typography>Feels like {
                WeatherInfo.parseKelvin(mainJSON["feels_like"], WeatherInfo.kelvinToCelcius)
            }°</Typography>
            <Box component="img" src={WeatherInfo.getIconURL(weatherJSON["icon"])} />
        </section>
    }

    return null;
}

function WeatherPreviewCard(json) {
    const date = new Date(json["dt"] * 1000);
    return <Typography>
        <Typography>
            {date.getHours()}:{date.getMinutes()}
        </Typography>
        <Box component="img" src={"https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + ".png"} />
        <Typography>{
            WeatherInfo.parseKelvin(json["main"]["temp"], WeatherInfo.kelvinToCelcius)
        }°</Typography>
    </Typography>
}

function WeatherPreview({json, enabled}) {
    return enabled === true ? <ListCard scrollerClassName="horizontalScroller" expanded={true} childPropsList={json} childTemplate={WeatherPreviewCard} ></ListCard> : <div></div>
}

function WeatherCard(json) {
    // s -> ms
    const date = new Date(json["dt"] * 1000);
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = date.getDay();
    return <div>
        <Typography>
            {days[dayIndex]}
        </Typography>
        <Box component="img" src={"https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + ".png"} />
        <Typography>{
            WeatherInfo.parseKelvin(json["main"]["temp"], WeatherInfo.kelvinToCelcius)
        }°</Typography>
    </div>;

}

function WeatherForecastCard({ json, enabled }) {
    return enabled === true ? <ListCard expanded={true} showTitle title={"Weekly weather"} childPropsList={json} childTemplate={WeatherCard} ></ListCard> : <div></div>
}


