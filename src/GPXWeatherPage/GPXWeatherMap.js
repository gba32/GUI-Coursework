import { MapContainer, TileLayer } from "react-leaflet";
import './GPXWeatherPage.css';

export default function GPXWeatherMap(props) {
    
    return (<MapContainer className="map" {...props}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.children}
    </MapContainer>)
}

