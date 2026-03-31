import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { MenuItem, Select, TextField, ThemeProvider, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import GPX from "gpx-parser-builder";
import L from 'leaflet';
import React, { useEffect, useState } from "react";
import { Marker, Polyline, Popup } from "react-leaflet";
import ErrorPage from "../ErrorPage/ErrorPage";
import { API_KEY } from "../KEY_PROVIDER";
import notFoundIcon from "../NotFound.png";
import { APP_THEME } from "../Theme/Theme";
import GPXUtil from "../Utility/GPXUtil";
import StorageUtil from "../Utility/StorageUtil";
import { SPEED_UNITS, SpeedUnit, TEMP_UNITS, TempUnit, UnitUtil } from "../Utility/UnitUtil";
import { WeatherUtil } from "../Utility/WeatherUtil";
import shadow from '../iconShadow.png';
import GPXWeatherMap from "./GPXWeatherMap";
import './GPXWeatherPage.css';

/**
 * A Page for displaying weather information over time for tracks on a GPX file.
 * If the GPX file data cannot be loaded, an error page is shown and the user is redirected home. 
 * @returns 
 */
export default function GPXWeatherPage() {
    const gpxData = StorageUtil.read("GPX_DATA");

    return gpxData === null ? <ErrorPage message="Failed to load gpx data" timeoutSeconds={10} redirectTo={"/"} /> : <GPXWeatherMapPage gpx={GPXUtil.loadGPX(gpxData)} />;
}

/**
 * A panel that displays over the map to control its settings.
 * 
 * @param {*} props
 * @param pace a state value which controls the currently displayed pace
 * @param props.onPaceChanged A callback function to be called when the value of the pace is changed.
 * @param props.onStartTimeChanged A callback function to be called when the value of the start time is changed
 * @param props.onUnitChanged A callback function to be called when the pace unit is changed
 * @returns 
 */
function OptionsPanel({ pace, onPaceChanged = () => { }, onStartTimeChanged = (date) => { }, onUnitChanged = (newIndex) => { } }) {
    let [error, setError] = useState(false);
    let [date, setDate] = useState(dayjs)

    return <article className="pacePanel">
        <Typography variant="h5">Options</Typography>
        <div>
            <TextField label="Pace" value={pace} error={error} onChange={(event) => {
                let pace = event.target.value;
                // Only update when the value is valid
                if (isNaN(pace) || pace === "" || pace < 0) {
                    setError(true);
                } else {
                    setError(false);
                    onPaceChanged(pace);
                }
            }} />

            <Select label="Units" onChange={(event) => {
                console.log(event);
                onUnitChanged(event.target.value)
            }} defaultValue={0}>
                <MenuItem value={0}>m/s</MenuItem>
                <MenuItem value={1}>mph</MenuItem>
                <MenuItem value={2}>kph</MenuItem>
            </Select>
        </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker value={date} onChange={(newValue) => {
                    setDate(newValue);
                    onStartTimeChanged(newValue);
                }} />
            </LocalizationProvider>
        </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker value={date} onChange={(newValue) => {
                    setDate(newValue);
                    onStartTimeChanged(newValue);
                }} />
            </LocalizationProvider>
        </div>
    </article>
}

/**
 * Displays an annotated map of the given gpx's tracks with weather information.
 * 
 * @param {GPX} gpx The GPX to display information for.
 * @returns 
 */
function GPXWeatherMapPage({ gpx }) {
    const apiKey = API_KEY;
    const SECONDS_PER_HOUR = 60.0 * 60;

    let [markers, setMarkers] = useState([]);
    let [loaded, setLoaded] = useState(false);
    let [trackWeatherJSON, setTrackWeatherJSON] = useState({});
    let [pace, setPace] = useState(1);
    let [unitIndex, setUnitIndex] = useState(0);
    let [startDate, setStartDate] = useState(dayjs());
    let mapDetails = GPXUtil.getMapDetails(gpx);
    let tempUnits = [TEMP_UNITS.CELCIUS, TEMP_UNITS.FAHRENHEIT];
    let speedUnits = [SPEED_UNITS.MS, SPEED_UNITS.MPH, SPEED_UNITS.KPH];

    let storedTempUnit = StorageUtil.read("TEMP_UNIT");
    let storedWindUnit = StorageUtil.read("WIND_UNIT");
    let tempUnit = tempUnits[storedTempUnit === null ? 0 : storedTempUnit];
    let windUnit = speedUnits[storedWindUnit === null ? 0 : storedWindUnit];
    const options = { color: 'red' };

    // Only load weather data on initial load to avoid a large amount of requests
    useEffect(() => {
        if (!loaded) {
            GPXUtil.fetchGPXWeather(apiKey, gpx)
                .then(gpxWeather => {
                    setTrackWeatherJSON(gpxWeather.trackWeatherJSON);
                    setLoaded(true);
                })
        }
    }, [loaded])

    // Map and UI management
    useEffect(() => {
        if (loaded) {
            let newMarkers = [];
            let units = [SPEED_UNITS.MS, SPEED_UNITS.MPH, SPEED_UNITS.KPH];
            let scaledPace = SpeedUnit.convert(pace, units[unitIndex], SPEED_UNITS.MS);

            // Convert weather data for each track into individual markers
            trackWeatherJSON.forEach(
                (track, trackIndex) => {
                    let distances = GPXUtil.getCumalativeDistance(gpx.trk[trackIndex]);
                    // 4 m/s pace
                    let trackMarkers = track.map((point) => {
                        let json = point["result"]["json"];
                        let etaDate = startDate.add(distances[point.pointIndex] / scaledPace, 's');
                        let weatherIndex = GPXUtil.getWeatherIndex(json["list"], etaDate.valueOf(), 3 * SECONDS_PER_HOUR);

                        // Check if the eta was within the bounds of the weather data
                        let validIndex = weatherIndex !== null;
                        let weatherJSON = undefined;
                        let mainJSON = undefined;
                        let windJSON = undefined;

                        if (validIndex) {
                            let resultJSON = json["list"][weatherIndex];
                            weatherJSON = resultJSON["weather"][0];
                            mainJSON = resultJSON["main"];
                            windJSON = resultJSON["wind"];
                        }

                        let icon = L.icon({
                            iconUrl: validIndex ? WeatherUtil.getIconURL(weatherJSON["icon"]) : notFoundIcon,
                            iconSize: [50, 50],
                            iconAnchor: [25, 25],
                            shadowUrl: shadow,
                            shadowSize: [50, 50],
                            shadowAnchor: [25, 25]
                        })

                        let roundedTemp = UnitUtil.round(TempUnit.convert(parseFloat(mainJSON["temp"]), TEMP_UNITS.KELVIN, tempUnit),0);
                        let roundedFeel = UnitUtil.round(TempUnit.convert(parseFloat(mainJSON["feels_like"]), TEMP_UNITS.KELVIN, tempUnit),0);
                        let roundedWindSpeed = UnitUtil.round(SpeedUnit.convert(windJSON["speed"], SPEED_UNITS.MS, windUnit), 2);
                        let content = validIndex ?
                            <React.Fragment>
                                <Typography>Temp: {roundedTemp}° </Typography>
                                <Typography>Feels like: {roundedFeel}°</Typography>
                                <Typography>Wind speed: {roundedWindSpeed}{SpeedUnit.getUnitString(windUnit)} <ArrowUpwardIcon sx={{ rotate: windJSON["deg"] + "deg", margin: "0" }} /> </Typography>
                            </React.Fragment> : <React.Fragment>
                                <Typography>Cannot get weather data for this time.</Typography> 
                            </React.Fragment>

                        return <Marker position={[point.result.lat, point.result.lon]} icon={icon}>
                            <Popup>
                                <Typography>{json["city"]["name"]}</Typography>
                                <Typography>
                                    ETA: {etaDate.format('dddd MMM YYYY [at] HH:mm:ss')}
                                </Typography>
                                {content}
                            </Popup>
                        </Marker>
                    });

                    newMarkers.push(...trackMarkers);
                }
            );
            setMarkers(newMarkers);
        }
    }, [loaded, gpx, pace, unitIndex, startDate]);

    return (
        <ThemeProvider theme={APP_THEME}>
            <div className="mapContainer" >
                <GPXWeatherMap center={mapDetails.position} zoom={13} scrollWheelZoom={false}>
                    <Polyline pathOptions={options} positions={mapDetails.segmentLines} />
                    {markers}
                    <OptionsPanel pace={pace} onPaceChanged={(pace) => setPace(pace)} onStartTimeChanged={(newDate) => { setStartDate(newDate) }} onUnitChanged={(index) => {
                        // Convert value from old unit to new unit
                        let oldIndex = unitIndex;
                        setUnitIndex(index)
                        setPace(UnitUtil.round(SpeedUnit.convert(pace, oldIndex, index), 2));  
                    }} />
                </GPXWeatherMap>
            </div>
        </ThemeProvider>
    )
}