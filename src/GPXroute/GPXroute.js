import GPX from "gpx-parser-builder";
import { gpxData } from "./sampleGPX2";
import { WeatherInfo } from "../WeatherPage/WeatherPage"
import { API_KEY } from "../KEY_PROVIDER";

class GPXWeatherResult {
    constructor(waypointWeatherJSON, trackWeatherJSON) {
        this.waypointWeatherJSON = waypointWeatherJSON;
        this.trackWeatherJSON = trackWeatherJSON;
    }
}

export function loadGPX(gpxString) {
    return GPX.parse(gpxString);
}

export function getMapDetails(gpx) {
    let segmentLines = [];
    let position = [0, 0];
    let count = 0;

    gpx.trk.forEach(
        (track) => track.trkseg.forEach(
            (segment) => {
                let segmentLine = [];
                segment.trkpt.forEach(
                    (point) => {
                        const pointCoords = [parseFloat(point.$.lat), parseFloat(point.$.lon)]
                        position[0] += pointCoords[0];
                        position[1] += pointCoords[1];
                        segmentLine.push(pointCoords);
                        count += 1;
                    }
                )
                segmentLines.push(segmentLine);
            }
        )
    );

    if (count !== 0) {
        position[0] /= count;
        position[1] /= count;
    }
    return { segmentLines: segmentLines, position: position };
}

function fetchWeatherAtPoint(apiKey, point) {
    return WeatherInfo.fetchForecast3Hour(apiKey, point.$.lon, point.$.lat).then(
        (json) => {
            return { lon: point.$.lon, lat: point.$.lat, json: json };
        }
    )
}

export function getTotalTrackLength(gpx) {
    let sum = 0;
    gpx.trk.forEach(
        (track) => track.trkseg.forEach(
            (segment) => {
                if (segment.trkpt.length === 0) {
                    return;
                }

                for (let i = 1; i < segment.trkpt.length; i++) {
                    let p1 = segment.trkpt[i - 1];
                    let p2 = segment.trkpt[i];

                    let d = distance([parseFloat(p1.$.lat), parseFloat(p1.$.lon)], [parseFloat(p2.$.lat), parseFloat(p2.$.lon)]);
                    sum += d;
                }
            }
        )
    );

    return sum;
}

/**
 * 
 * Fetches the weather for points on a gpx route. To avoid sending a large amount of requests, weather is only queried for points at a given frequency.
 * 
 * @param {GPX} gpx 
 * @param {*} distanceThreshold 
 * @returns 
 */
export function fetchGPXWeather(apiKey, gpx, distanceThreshold = 10000) {
    let tracks = gpx.trk !== undefined ? Promise.all(gpx.trk.map(
        (track) => Promise.all(track.trkseg.map(
            (segment) => {
                if (segment.trkpt.length === 0) {
                    return [];
                }

                let pointPromises = [fetchWeatherAtPoint(apiKey, segment.trkpt[0])];
                let currentAnchor = segment.trkpt[0];

                for (let i = 1; i < segment.trkpt.length; i++) {
                    let point = segment.trkpt[i];
                    let d = distance([parseFloat(currentAnchor.$.lat), parseFloat(currentAnchor.$.lon)], [parseFloat(point.$.lat), parseFloat(point.$.lon)]);
                    if (d > distanceThreshold) {
                        pointPromises.push(
                            fetchWeatherAtPoint(apiKey, point)
                        );
                        currentAnchor = point;
                    }
                }
                return Promise.all(pointPromises);
            }
        )
        )
    )) : new Promise(() => { });

    let waypoints = gpx.wpt !== undefined ? Promise.all(gpx.wpt.map(
        (point) => WeatherInfo.fetchForecast3Hour(apiKey, point.$.lon, point.$.lat)
    )) : new Promise(() => { });

    return Promise.all([waypoints, tracks]).then((data) => new GPXWeatherResult(data[0], data[1][0]));
}

/**
 * Calculates the distance between two lat/lon pairs on the Earth. 
 * Assumes that the Earth is a perfect sphere.
 * https://en.wikipedia.org/wiki/Haversine_formula
 * 
 * Could also use https://en.wikipedia.org/wiki/Vincenty%27s_formulae
 * but this seems like overkill for the task at hand
 * 
 * @param {Array<number>} pair1 first lat/lon pair
 * @param {Array<number>} pair2 second lat/lon pair 
 */
export function distance([lat1, lon1], [lat2, lon2]) {
    // Earth radius to 4sf
    const EARTH_RADIUS_M = 6378000;
    const d_lat = Math.abs(lat1 - lat2);
    const d_lon = Math.abs(lon1 - lon2);
    const m_lat = (lat1 + lat2) / 2.0;

    const s_lat = Math.sin(degToRad(d_lat) / 2.0);
    const s2_lat = s_lat * s_lat;

    const s_lon = Math.sin(degToRad(d_lon) / 2.0);
    const s2_lon = s_lon * s_lon;

    const sm_lat = Math.sin(degToRad(m_lat));
    const sm2_lat = sm_lat * sm_lat;

    const h_theta = s2_lat + (1.0 - s2_lat - sm2_lat) * s2_lon;
    return 2.0 * Math.asin(Math.sqrt(h_theta)) * EARTH_RADIUS_M;
}

function degToRad(degrees) {
    return (Math.PI / 180) * degrees;
}