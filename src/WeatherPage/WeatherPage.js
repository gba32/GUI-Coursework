import { Box, ThemeProvider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { API_KEY } from "../KEY_PROVIDER";
import ListCard from "../ListCard/ListCard";
import NavigationBar from "../NavigationBar/NavigationBar";
import { APP_THEME } from "../Theme/Theme";
import { RenderOptional } from "../Utility/ReactUtil";
import StorageUtil from "../Utility/StorageUtil";
import { WeatherUtil } from "../Utility/WeatherUtil";
import "./WeatherPage.css";
import ErrorPage from "../ErrorPage/ErrorPage";

export default function WeatherPage() {
    let locationData = StorageUtil.read("location");
    return locationData === null ? <ErrorPage message={"Failed to load weather information for location"} timeoutSeconds={5} redirectTo="/home" /> : <WeatherPageInternal locationData={JSON.parse(locationData)} />
}

function WeatherPageInternal({ locationData }) {
    let [currentWeatherJSON, setCurrentWeather] = useState({ data: {}, loaded: false });
    let [dailyWeatherJSON, setDailyWeather] = useState({ data: {}, loaded: false });
    const apiKey = API_KEY;
    let navigator = useNavigate();

    useEffect(() => {
        WeatherUtil.fetchForecast3Hour(apiKey, locationData["lon"], locationData["lat"]).then(result => {
            if(result.status == 200) {
                setDailyWeather({ data: result.response["list"], loaded: true });
            }
        });

        WeatherUtil.fetchForecast1Hour(apiKey, locationData["lon"], locationData["lat"], 6).then(result => {
            if(result.status == 200) {
                setCurrentWeather({ data: result.response["list"], loaded: true });
            }
        })
    }, [])

    return (
        <ThemeProvider theme={APP_THEME}>
            <main>
                <NavigationBar onBackPressed={() => navigator(-1)} showBackButton title={locationData["name"]}></NavigationBar>
                <RenderOptional enabled={currentWeatherJSON.loaded}>
                    <CurrentWeatherCard json={currentWeatherJSON.data[0]} enabled={currentWeatherJSON.loaded} />
                </RenderOptional>
                <RenderOptional enabled={currentWeatherJSON.loaded}>
                    <WeatherPreview json={currentWeatherJSON.data} enabled={currentWeatherJSON.loaded} />
                </RenderOptional>
                <RenderOptional enabled={dailyWeatherJSON.loaded}>
                    <WeatherForecastCard json={dailyWeatherJSON.data} enabled={dailyWeatherJSON.loaded} />
                </RenderOptional>
            </main>
        </ThemeProvider>
    );
}

function CurrentWeatherCard({ json }) {
    const mainJSON = json["main"];
    const weatherJSON = json["weather"][0];

    return <section className="currentWeatherCard">
        <Typography variant="h1">{
            WeatherUtil.parseKelvin(mainJSON["temp"], WeatherUtil.kelvinToCelcius)
        }°</Typography>
        <Typography>Feels like {
            WeatherUtil.parseKelvin(mainJSON["feels_like"], WeatherUtil.kelvinToCelcius)
        }°</Typography>
        <Box component="img" src={WeatherUtil.getIconURL(weatherJSON["icon"])} />
    </section>
}

function WeatherPreview({ json }) {
    return <ListCard scrollerClassName="horizontalScroller" expanded={true} childPropsList={json} childTemplate={WeatherPreviewCard} />
}

function WeatherPreviewCard(json) {
    const date = new Date(json["dt"] * 1000);
    return <div>
        <Typography>
            {date.getHours()}:{date.getMinutes().toString().padStart(2, "0")}
        </Typography>
        <Box component="img" src={"https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + ".png"} />
        <Typography>{
            WeatherUtil.parseKelvin(json["main"]["temp"], WeatherUtil.kelvinToCelcius)
        }°</Typography>
    </div>
}

function WeatherCard(dayJSON) { 
    // s -> ms
    const json = dayJSON[0];
    const date = new Date(json["dt"] * 1000);
    let high = undefined;
    let low = undefined;

    dayJSON.forEach((element) => {
        let temp = WeatherUtil.parseKelvin(element["main"]["temp"], WeatherUtil.kelvinToCelcius);
        if(high === undefined || high < temp) {
            high = temp;
        }

        if (low === undefined || low > temp) {
            low = temp
        }
    });

    return <div>
        <Typography>
            {WeatherUtil.getDayString(date.getDay())}
        </Typography>
        <Box component="img" src={"https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + ".png"} />
        <Typography>{
            WeatherUtil.parseKelvin(json["main"]["temp"], WeatherUtil.kelvinToCelcius)
        }°</Typography>
        <Typography>
            {low}°|{high}°
        </Typography>
    </div>;

}

function WeatherForecastCard({ json }) {
    let days = []
    let currentDay = 0;
    const DAY_SECONDS = 24 * 60 * 60;
    json.forEach((forecastJSON) => {
        let seconds = parseInt(forecastJSON["dt"]);
        let day = Math.floor(seconds / DAY_SECONDS);
        if (day !== currentDay) {
            days.push([forecastJSON]);
            currentDay = day;
        } else {
            days.at(-1).push(forecastJSON);
        }
    });

    return <ListCard expanded={true} showTitle title={"Weekly weather"} childPropsList={days} childTemplate={WeatherCard} />
}


