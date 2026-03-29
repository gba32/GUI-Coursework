import { MapContainer, Polyline } from "react-leaflet";
import NavigationBar from "../NavigationBar/NavigationBar";
import GPXWeatherMap from "../GPXWeatherPage/GPXWeatherMap";
import { getMapDetails, getTotalTrackLength, loadGPX } from "../GPXroute/GPXroute";
import { gpxData } from "../GPXroute/sampleGPX2";
import { APP_THEME } from "../Theme/Theme";
import { Button, ButtonGroup, ThemeProvider, Typography } from "@mui/material";
import './DetailsPage.css';

export default function DetailsPage() {
    const options = { color: 'red' };
    let gpx = loadGPX(gpxData);
    let mapDetails = getMapDetails(gpx);

    let lengthText = "";
    let length = getTotalTrackLength(gpx);
    if (length < 1000) {
        lengthText = length + "m";
    } else {
        lengthText = Math.round(length / 1000) + "km";
    }
    return (
        <ThemeProvider theme={APP_THEME}>
            <NavigationBar title="Details" />
            <article id="preview">
                <div className="detailsCard">
                    <div className='title'> <Typography variant='h5'> <b> {gpx.metadata.name} </b> </Typography> </div>
                    <Typography>Total distance: {lengthText}</Typography>
                </div>
                
                
                <section className="detailsCard">
                    <div className='title'> <Typography variant='h5'> <b> Preview </b> </Typography> </div>
                    <div id="container">
                        <GPXWeatherMap center={mapDetails.position} zoom={13} scrollWheelZoom={false}>
                            <Polyline pathOptions={options} positions={mapDetails.segmentLines} />
                        </GPXWeatherMap>
                    </div>
                </section>
                <ButtonGroup variant="contained">
                    <Button>Cancel</Button>
                    <Button>Confirm</Button>
                </ButtonGroup>
            </article>
        </ThemeProvider>
    );

}