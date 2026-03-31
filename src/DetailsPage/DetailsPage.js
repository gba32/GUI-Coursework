import { Polyline } from "react-leaflet";
import NavigationBar from "../NavigationBar/NavigationBar";
import GPXWeatherMap from "../GPXWeatherPage/GPXWeatherMap";
import { APP_THEME } from "../Theme/Theme";
import { Button, ButtonGroup, ThemeProvider, Typography } from "@mui/material";
import './DetailsPage.css';
import { useNavigate } from "react-router";
import ErrorPage from "../ErrorPage/ErrorPage";
import StorageUtil from "../Utility/StorageUtil";
import GPXUtil from "../Utility/GPXUtil";


export default function DetailsPage() {
    let gpxData = StorageUtil.read("GPX_DATA");

    return gpxData === null ? <ErrorPage message="Failed to load gpx data" timeoutSeconds={10} redirectTo={"/"} /> : <DetailsPageInternal gpx={GPXUtil.loadGPX(gpxData)} />;
}

function formatDistance(distance, roundKM) {
    if (distance < 1000 || !roundKM) {
        return Math.floor(distance) + "m";
    }
    return Math.round(distance / 1000) + "km";
}

function DetailsPageInternal({ gpx }) {
    const options = { color: 'red' };
    let navigator = useNavigate();
    let confirmHandler = () => {
        navigator("/gpx")
    }

    let cancelHandler = () => {
        StorageUtil.reset("GPX_DATA");
        navigator(-1);
    }

    let mapDetails = GPXUtil.getMapDetails(gpx);

    let lengthText = formatDistance(GPXUtil.getTotalTrackLength(gpx), true);
    let elevationText = formatDistance(GPXUtil.calculateElevation(gpx), false);

    return (
        <ThemeProvider theme={APP_THEME}>
            <article id="preview">

                <section className="detailsCard">
                    <div className='title'> <Typography variant='h5'> <b> {gpx.metadata.name} </b> </Typography> </div>
                    <Typography>Total distance: {lengthText}</Typography>
                    <Typography>Total elevation: {elevationText}</Typography>
                </section>


                <section className="detailsCard">
                    <div className='title'> <Typography variant='h5'> <b> Preview </b> </Typography> </div>
                    <div id="container">
                        <GPXWeatherMap center={mapDetails.position} zoom={13} scrollWheelZoom={false}>
                            <Polyline pathOptions={options} positions={mapDetails.segmentLines} />
                        </GPXWeatherMap>
                    </div>
                </section>

                <ButtonGroup variant="contained">
                    <Button onClick={cancelHandler}>Cancel</Button>
                    <Button onClick={confirmHandler}>Confirm</Button>
                </ButtonGroup>
            </article>
        </ThemeProvider>
    );

}