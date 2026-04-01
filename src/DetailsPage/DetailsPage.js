import { Button, Typography } from "@mui/material";
import GPX from "gpx-parser-builder";
import { Polyline } from "react-leaflet";
import { useNavigate } from "react-router";
import ErrorPage from "../ErrorPage/ErrorPage";
import GPXWeatherMap from "../GPXWeatherPage/GPXWeatherMap";
import GPXUtil from "../Utility/GPXUtil";
import StorageUtil from "../Utility/StorageUtil";
import './DetailsPage.css';

/**
 * A Page for displaying the details of a GPX file, which can then be confirmed or cancelled.
 * If the GPX file data cannot be loaded, an error page is shown and the user is redirected home. 
 */
export default function DetailsPage() {
    let gpxData = StorageUtil.read("GPX_DATA");

    return gpxData === null ? <ErrorPage message="Failed to load gpx data" timeoutSeconds={10} redirectTo={"/"} /> : <DetailsPageInternal gpx={GPXUtil.loadGPX(gpxData)} />;
}

/**
 * Formats a distance into a simple, consistent format
 * 
 * @param {number} distance the distance in meters
 * @param {boolean} roundKM a flag indicating whether distances above 1000m should be converted to km
 * @returns {string}
 */
function formatDistance(distance, roundKM) {
    if (distance < 1000 || !roundKM) {
        return Math.floor(distance) + "m";
    }
    return Math.round(distance / 1000) + "km";
}

/**
 * 
 * @param {GPX} gpx - a GPX object holding the track that should have details displayed
 * @returns 
 */
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
            <article id="preview">
                <section className="detailsCard">
                    <div className='title'> <Typography variant='h5'> <b> {gpx.metadata.name} </b> </Typography> </div>
                    <Typography>Total distance: {lengthText}</Typography>
                    <Typography>Total elevation: {elevationText}</Typography>
                </section>

                {/* Preview of map */}
                <section className="detailsCard">
                    <div className='title'> <Typography variant='h5'> <b> Preview </b> </Typography> </div>
                    <div id="container">
                        <GPXWeatherMap center={mapDetails.position} zoom={13} scrollWheelZoom={false}>
                            <Polyline pathOptions={options} positions={mapDetails.segmentLines} />
                        </GPXWeatherMap>
                    </div>
                </section>

                <section className="confirmationBar" variant="contained">
                    <Button variant="contained" onClick={cancelHandler}>Cancel</Button>
                    <Button variant="contained" onClick={confirmHandler}>Confirm</Button>
                </section>
            </article>
    );
}