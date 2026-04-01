import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ErrorPage from "../ErrorPage/ErrorPage";
import { API_KEY } from "../KEY_PROVIDER";
import ListCard from "../ListCard/ListCard";
import TitleBar from "../NavigationBar/NavigationBar";
import { RenderOptional } from "../Utility/ReactUtil";
import StorageUtil, { STORAGE_KEY } from "../Utility/StorageUtil";
import { TEMP_UNITS, TempUnit, UnitUtil } from "../Utility/UnitUtil";
import { WeatherUtil } from "../Utility/WeatherUtil";
import "./WeatherPage.css";

/**
 * Displays weather information for a given location. If the location data is not set, an error page is shown and the user is redirected home.
 */
export default function WeatherPage() {
    let locationData = StorageUtil.read("location");
    return locationData === null ? <ErrorPage message={"Failed to load weather information for location"} timeoutSeconds={5} redirectTo="/" /> : <WeatherPageInternal locationData={JSON.parse(locationData)} />
}

/**
 * An internal function to display valid weather information for a given location
 * 
 * @param {*} locationData Geocoding information for a given location
 */
function WeatherPageInternal({ locationData }) {
    const apiKey = API_KEY;
    let [currentWeatherJSON, setCurrentWeather] = useState({ data: {}, loaded: false });
    let [dailyWeatherJSON, setDailyWeather] = useState({ data: {}, loaded: false });
    let navigator = useNavigate();
    let tempUnits = [TEMP_UNITS.CELCIUS, TEMP_UNITS.FAHRENHEIT];
    let unit = tempUnits[StorageUtil.read(STORAGE_KEY.TEMP, 0)];

    // Fetch weather data only on initial load
    useEffect(() => {
        WeatherUtil.fetchForecast3Hour(apiKey, locationData["lon"], locationData["lat"]).then(result => {
            if (result.status === 200) {
                setDailyWeather({ data: result.response["list"], loaded: true });
            }
        });

        WeatherUtil.fetchForecast1Hour(apiKey, locationData["lon"], locationData["lat"], 6).then(result => {
            if (result.status === 200) {
                setCurrentWeather({ data: result.response["list"], loaded: true });
            }
        })
    }, [apiKey, locationData])

    return (
        <main>
            <TitleBar onBackPressed={() => navigator(-1)} showBackButton title={locationData["name"]}></TitleBar>
            <RenderOptional enabled={currentWeatherJSON.loaded}>
                <CurrentWeatherCard unit={unit} json={currentWeatherJSON.data[0]} />
            </RenderOptional>
            <RenderOptional enabled={currentWeatherJSON.loaded}>
                <WeatherPreview unit={unit} json={currentWeatherJSON.data} />
            </RenderOptional>
            <RenderOptional enabled={dailyWeatherJSON.loaded}>
                <WeatherForecastCard unit={unit} json={dailyWeatherJSON.data} />
            </RenderOptional>
        </main>
    );
}

/**
 * A card displaying the current weather information.
 * 
 * @param {*} props
 * @param {*} props.json The weather data for the current time.
 * @param {*} props.unit The unit to display temperature in.
 */
function CurrentWeatherCard({ json, unit }) {
    const mainJSON = json["main"];
    const weatherJSON = json["weather"][0];

    return <section className="currentWeatherCard">
        <Typography variant="h1">{
            UnitUtil.round(TempUnit.convert(parseFloat(mainJSON["temp"]), TEMP_UNITS.KELVIN, unit), 0)
        }°</Typography>
        <Typography>Feels like {
            UnitUtil.round(TempUnit.convert(parseFloat(mainJSON["feels_like"]), TEMP_UNITS.KELVIN, unit), 0)
        }°</Typography>
        <Box component="img" src={WeatherUtil.getIconURL(weatherJSON["icon"])} />
    </section>
}

/**
 * A card displaying forecasted weather information for the next few hours.
 * 
 * @param {*} props
 * @param {*} props.json The weather data for the next few hours.
 * @param {*} props.unit The unit to display temperature in.
 */
function WeatherPreview({ json, unit = TEMP_UNITS.CELCIUS }) {
    return <ListCard scrollerClassName="horizontalScroller" expanded={true} childPropsList={json.map((element) => { return { json: element, unit: unit } })} childTemplate={WeatherPreviewCard} />
}

/**
 * A list item displaying forecasted weather information for a given hour.
 * 
 * @param {*} props
 * @param {*} props.json The weather data for the current time.
 * @param {*} props.unit The unit to display temperature in.
 */
function WeatherPreviewCard({ json, unit = TEMP_UNITS.CELCIUS }) {
    const date = dayjs(json["dt"] * 1000);
    return <div>
        <Typography>
            {date.format("HH:mm")}
        </Typography>
        <Box component="img" src={"https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + ".png"} />
        <Typography>{
            UnitUtil.round(TempUnit.convert(json["main"]["temp"], TEMP_UNITS.KELVIN, unit), 0)
        }°</Typography>
    </div>
}

/**
 * A list item displaying forecasted weather information for a given day.
 * 
 * @param {*} props
 * @param {Array<*>} props.json The weather data for the day.
 * @param {*} props.unit The unit to display temperature in.
 */
function WeatherCard({ dayJSON, unit = TEMP_UNITS.CELCIUS }) {
    // s -> ms
    console.log(dayJSON);
    const json = dayJSON[0];
    const date = dayjs(json["dt"] * 1000);
    let high = undefined;
    let low = undefined;

    dayJSON.forEach((element) => {
        let temp = UnitUtil.round(TempUnit.convert(element["main"]["temp"], TEMP_UNITS.KELVIN, unit), 0);
        if (high === undefined || high < temp) {
            high = temp;
        }

        if (low === undefined || low > temp) {
            low = temp
        }
    });

    return <div>
        <Typography>
            {date.format("dddd")}
        </Typography>
        <Box component="img" src={"https://openweathermap.org/img/wn/" + json["weather"][0]["icon"] + ".png"} />
        <Typography>{
            UnitUtil.round(TempUnit.convert(json["main"]["temp"], TEMP_UNITS.KELVIN, unit), 0)
        }°</Typography>
        <Typography>
            {low}°|{high}°
        </Typography>
    </div>;

}

/**
 * A card displaying forecasted weather information for the next few days.
 * 
 * @param {*} props
 * @param {*} props.json The weather data for the next few days.
 * @param {*} props.unit The unit to display temperature in.
 */
function WeatherForecastCard({ json, unit = TEMP_UNITS.CELCIUS }) {
    let days = []
    let currentDay = 0;
    const DAY_SECONDS = 24 * 60 * 60;

    // Segment the forecasted data based on the day
    json.forEach((forecastJSON) => {
        let seconds = parseInt(forecastJSON["dt"]);
        let day = Math.floor(seconds / DAY_SECONDS);
        if (day !== currentDay) {
            days.push({ dayJSON: [forecastJSON], unit: unit });
            currentDay = day;
        } else {
            days.at(-1).dayJSON.push(forecastJSON);
        }
    });

    return <ListCard expanded={true} showTitle title={"Weekly weather"} childPropsList={days} childTemplate={WeatherCard} />
}


