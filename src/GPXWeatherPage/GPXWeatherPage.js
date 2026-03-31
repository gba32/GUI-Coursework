import { MenuItem, Select, TextField, ThemeProvider, Typography } from "@mui/material";
import L from 'leaflet';
import React, { useEffect, useRef, useState } from "react";
import { Marker, Polyline, Popup } from "react-leaflet";
import ErrorPage from "../ErrorPage/ErrorPage";
import { API_KEY } from "../KEY_PROVIDER";
import NavigationBar from "../NavigationBar/NavigationBar";
import { APP_THEME } from "../Theme/Theme";
import GPXUtil from "../Utility/GPXUtil";
import StorageUtil from "../Utility/StorageUtil";
import { WeatherUtil } from "../Utility/WeatherUtil";
import shadow from '../iconShadow.png';
import GPXWeatherMap from "./GPXWeatherMap";
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './GPXWeatherPage.css';
import dayjs from "dayjs";
import notFoundIcon from "../NotFound.png"
import Track from "gpx-parser-builder/src/track";

export default function GPXWeatherPage() {
    const gpxData = StorageUtil.read("GPX_DATA");

    return gpxData === null ? <ErrorPage message="Failed to load gpx data" timeoutSeconds={10} redirectTo={"/"} /> : <GPXWeatherMapPage gpx={GPXUtil.loadGPX(gpxData)} />;
}

function OptionsPanel({ onPaceChanged = () => { }, onStartTimeChanged = (date) => { }, onUnitChanged = (event) => { } }) {
    let [error, setError] = useState(false);
    let [date, setDate] = useState(dayjs)

    return <article className="pacePanel">
        <Typography variant="h5">Options</Typography>
        <div>
            <TextField label="Pace" error={error} onChange={(event) => {
                let pace = event.target.value;
                if (isNaN(pace) || pace < 0) {
                    setError(true);
                } else {
                    setError(false);
                    onPaceChanged(parseFloat(pace));
                }
            }} />

            <Select label="Units" onChange={onUnitChanged} defaultValue={0}>
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

function GPXWeatherMapPage({ gpx }) {
    const apiKey = API_KEY;
    let [markers, setMarkers] = useState([]);
    let [loaded, setLoaded] = useState(false);
    let [trackWeatherJSON, setTrackWeatherJSON] = useState({});
    let [pace, setPace] = useState(1);
    let [unitIndex, setUnitIndex] = useState(0);
    let [startDate, setStartDate] = useState(dayjs());
    let mapDetails = GPXUtil.getMapDetails(gpx);

    const options = { color: 'red' };

    useEffect(() => {
        if (!loaded) {
            GPXUtil.fetchGPXWeather(apiKey, gpx)
                .then(gpxWeather => {
                    console.log("LOADED");
                    setTrackWeatherJSON(gpxWeather.trackWeatherJSON);
                    setLoaded(true);
                })
        } else {
            let newMarkers = [];
            let scaledPace = pace;
            const METERS_PER_MILE = 1609.344;
            const METERS_PER_KM = 1000;
            const SECONDS_PER_HOUR = 60.0 * 60;
            switch (unitIndex) {
                // M/s
                case 0:
                    break;

                // MPH
                case 1:
                    scaledPace *= (METERS_PER_MILE / SECONDS_PER_HOUR);
                    break;

                // KPH
                case 2:
                    scaledPace *= (METERS_PER_KM / SECONDS_PER_HOUR);
                    break;
            }

            trackWeatherJSON.forEach(
                (track, trackIndex) => {
                    let distances = GPXUtil.getCumalativeDistance(gpx.trk[trackIndex]);
                    // 4 m/s pace
                    console.log("JSON:", track);
                    let trackMarkers = track.map((point) => {
                        let json = point["result"]["json"];
                        let etaDate = startDate.add(distances[point.pointIndex] / scaledPace, 's');
                        let weatherIndex = GPXUtil.getWeatherIndex(json["list"], etaDate.valueOf(), 3 * 60 * 60);
                        let validIndex = weatherIndex !== null;

                        let weatherJSON = undefined;
                        let mainJSON = undefined;

                        if(validIndex) {
                            weatherJSON = json["list"][weatherIndex]["weather"][0];
                            mainJSON = json["list"][weatherIndex]["main"]
                        } 

                        let icon = L.icon({
                            iconUrl: validIndex ? WeatherUtil.getIconURL(weatherJSON["icon"]) : notFoundIcon,
                            iconSize: [50, 50],
                            iconAnchor: [25, 25],
                            shadowUrl: shadow,
                            shadowSize: [50, 50],
                            shadowAnchor: [25, 25]
                        })

                        let content = validIndex ?
                            <React.Fragment>
                                <Typography>Temp: {WeatherUtil.parseKelvin(mainJSON["temp"], WeatherUtil.kelvinToCelcius)}° </Typography>
                                <Typography>Feels like: {WeatherUtil.parseKelvin(mainJSON["feels_like"], WeatherUtil.kelvinToCelcius)}°</Typography>
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
                    <OptionsPanel onPaceChanged={(pace) => setPace(pace)} onStartTimeChanged={(newDate) => { setStartDate(newDate) }} onUnitChanged={(event) => { setUnitIndex(event.target.value) }} />
                </GPXWeatherMap>
            </div>
        </ThemeProvider>
    )
}