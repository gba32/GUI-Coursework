import { MapContainer, TileLayer } from "react-leaflet";
import './GPXWeatherPage.css';

/**
 * A generic map element using openstreetmap that can be used to display GPX data.
 * 
 * @param {*} props props to be passed to the map container
 */
export default function GPXWeatherMap(props) {
    
    return (<MapContainer className="map" {...props}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.children}
    </MapContainer>)
}

