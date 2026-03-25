import { CloudCircleRounded, Image } from "@mui/icons-material";
import { Box, Icon, ThemeProvider, Typography } from "@mui/material";
import ListCard from "../ListCard/ListCard";
import NavigationBar from "../NavigationBar/NavigationBar";
import "./WeatherPage.css"
import { APP_THEME } from "../Theme/Theme";
import { useEffect, useState } from "react";
import { data } from "react-router";



class WeatherInfo {
    constructor(weatherJSON) {
    }

    static fetchJSON(url, params) {
        return fetch(url + "?" + new URLSearchParams(params), { method: "GET" }).then(response => response.json());
    }

    static fetchForecast(apiKey, longitude, latitude) {
        return this.fetchJSON("http://api.openweathermap.org/data/2.5/forecast", { lat: latitude, lon: longitude, appid: apiKey });
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

}

export default function WeatherPage() {
    let [currentWeatherJSON, setCurrentWeather] = useState({ data: {}, loaded: false });
    let [dailyWeatherJSON, setDailyWeather] = useState({ data: {}, loaded: false });
    const apiKey = "0414fe2bfb563e65ceb082e39ae88ba7";

    useEffect(() => {
        WeatherInfo.fetchLocationData(apiKey, "London", 5)
            .then(json => {
                const longitude = json[0]["lon"];
                const latitude = json[0]["lat"];
                WeatherInfo.fetchForecast(apiKey, longitude, latitude).then(result => {
                    setCurrentWeather({ data: result["list"][0], loaded: true });
                    setDailyWeather({ data: result["list"], loaded: true });
                });

            });
    }, [])

    return (
        <ThemeProvider theme={APP_THEME}>
            <main>
                <NavigationBar showBackButton title="London"></NavigationBar>
                <CurrentWeatherCard json={currentWeatherJSON.data} enabled={currentWeatherJSON.loaded} />
                <WeatherForecastCard json={dailyWeatherJSON.data} enabled={dailyWeatherJSON.loaded} />
            </main>
        </ThemeProvider>
    );
}

function CurrentWeatherCard({ json, enabled }) {
    if(enabled) {
        const mainJSON = json["main"];
        const weatherJSON = json["weather"][0];
        return <section className="currentWeatherCard">
        <Typography variant="h1">{
            WeatherInfo.parseKelvin(mainJSON["temp"], WeatherInfo.kelvinToCelcius)
        }°</Typography>
        <Typography>Feels like {
            WeatherInfo.parseKelvin(mainJSON["feels_like"], WeatherInfo.kelvinToCelcius)
        }°</Typography>
        <Box component="img" src={"https://openweathermap.org/img/wn/" + weatherJSON["icon"] + ".png"} />
    </section> 
    }

    return null;
}

function WeatherCard(json) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = (new Date(json["dt"]).getDay());
    return <div>
        <Typography>
            {days[dayIndex]}
        </Typography>
        <Typography>{
            WeatherInfo.parseKelvin(json["main"]["temp"], WeatherInfo.kelvinToCelcius)
        }°</Typography>
    </div>;

}

function WeatherForecastCard({ json, enabled }) {
    return enabled === true ? <ListCard showTitle title={"Weekly weather"} childPropsList={json} childTemplate={WeatherCard} ></ListCard> : <div></div>
}


