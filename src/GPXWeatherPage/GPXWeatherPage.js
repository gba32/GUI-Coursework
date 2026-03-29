import { Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import { fetchGPXWeather, getMapDetails, loadGPX } from "../GPXroute/GPXroute";
import { API_KEY } from "../KEY_PROVIDER";
import { gpxData } from "../GPXroute/sampleGPX2";
import { colors, ThemeProvider, Typography } from "@mui/material";
import NavigationBar from "../NavigationBar/NavigationBar";
import { APP_THEME } from "../Theme/Theme";
import './GPXWeatherPage.css'
import { useEffect, useState } from "react";
import L from 'leaflet'
import { WeatherInfo } from "../WeatherPage/WeatherPage";
import shadow from '../iconShadow.png'
import GPXWeatherMap from "./GPXWeatherMap";

export default function GPXWeatherPage() {
    const apiKey = API_KEY;
    const gpx = loadGPX(gpxData);
    let [markers, setMarkers] = useState([]);
    let [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!loaded) {
            setLoaded(true);
            fetchGPXWeather(apiKey, gpx)
                .then(gpxWeather => {
                    let newMarkers = gpxWeather.trackWeatherJSON[0].map(
                        (point) => {
                            let weatherJSON = point.json["list"][0]["weather"][0];
                            let mainJSON = point.json["list"][0]["main"];

                            let icon = L.icon({
                                iconUrl: WeatherInfo.getIconURL(weatherJSON["icon"]),
                                iconSize: [50, 50],
                                iconAnchor: [25, 25],
                                shadowUrl: shadow,
                                shadowSize: [50, 50],
                                shadowAnchor: [25, 25]
                                
                            })

                            return <Marker position={[point.lat, point.lon]} icon={icon}>
                                <Popup>
                                    <Typography>{point.json["city"]["name"]}</Typography>
                                    <Typography>ETA: {"TBD"}</Typography>
                                    <Typography>Temp: {mainJSON["temp"]} </Typography>
                                    <Typography>Feels like: {mainJSON["feels_like"]}</Typography>
                                </Popup>
                            </Marker>
                        }
                    );
                    setMarkers(newMarkers);

                })
        }
    }, [loaded, gpx]);

    let mapDetails = getMapDetails(gpx);
    const options = { color: 'red' };

    return (
        <ThemeProvider theme={APP_THEME}>
            <NavigationBar title={gpx.metadata.name} />
            <div className="mapContainer" >
                <GPXWeatherMap center={mapDetails.position} zoom={13} scrollWheelZoom={false}>
                    <Polyline pathOptions={options} positions={mapDetails.segmentLines} />
                    {markers}
                </GPXWeatherMap>
            </div>
        </ThemeProvider>
    )
}