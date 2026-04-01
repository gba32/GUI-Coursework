import GPX from "gpx-parser-builder";
import { WeatherUtil } from "./WeatherUtil";
import Track from "gpx-parser-builder/src/track";
import Waypoint from "gpx-parser-builder/src/waypoint";

class GPXWeatherResult {
    constructor(waypointWeatherJSON, trackWeatherJSON) {
        this.waypointWeatherJSON = waypointWeatherJSON;
        this.trackWeatherJSON = trackWeatherJSON;
    }
}

export default class GPXUtil {
    static loadGPX(gpxString) {
        return GPX.parse(gpxString);
    }

    /**
     * Calculates display details for the given GPX.
     * @param {GPX} gpx GPX object containing the track data.
     * @returns The center position of the track and the lines between points.
     */
    static getMapDetails(gpx) {
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

    /**
     * @param {Track} track the track to calculate the distances for.
     * @returns an array where each index contains the total distance up to that point on the track.
     */
    static getCumalativeDistance(track) {
        let sum = 0;
        let flattened = flattenTrack(track);
        let distances = [0];
        for (let i = 1; i < flattened.length; i++) {
            let p1 = flattened[i - 1];
            let p2 = flattened[i];
            sum += GPXUtil.distance([parseFloat(p1.$.lat), parseFloat(p1.$.lon)], [parseFloat(p2.$.lat), parseFloat(p2.$.lon)]);
            distances.push(sum);
        }

        return distances;
    }

    /**
     * @param {GPX} gpx GPX object containing the track data.
     * @returns The sum of all track lengths in the GPX file.
     */
    static getTotalTrackLength(gpx) {
        let sum = 0;
        gpx.trk.forEach((track) => {
            sum += GPXUtil.getCumalativeDistance(track).at(-1);
        });

        return sum;
    }

    /**
     * Finds the forecast data that a given arrival time falls into.
     * 
     * @param {*} json Forecast data for the given point.
     * @param {*} arrivalTime The expected time of arrival.
     * @param {*} differenceUpperbound The maximum time difference allowed before the arrivalTime is considered out of the given bounds.
     * @returns index of the forecasted data for the given arrival time, or null if the arrival time falls out of the given bounds.
     */
    static getWeatherIndex(json, arrivalTime, differenceUpperboundSeconds) {
        let timeSeconds = arrivalTime / 1000;
        let initialDT = parseFloat(json[0]["dt"]);
        if (json.length === 0) {
            return null;
        }

        if (arrivalTime < initialDT) {
            return initialDT - arrivalTime > differenceUpperboundSeconds ? null : 0;
        }

        let difference = timeSeconds - parseFloat(json[json.length - 1]["dt"]);
        let i = 1;
        while (i <= json.length && parseFloat(json[i - 1]["dt"]) < timeSeconds) {
            i++;
        }

        return i > json.length
            ? (difference > differenceUpperboundSeconds ? null : json.length - 1)
            : i - 1;
    }


    /**
     * 
     * Fetches the weather for points on a gpx route. To avoid sending a large amount of requests, weather is only queried for points at a given frequency.
     * 
     * @param {GPX} gpx 
     * @param {*} distanceThreshold 
     * @returns 
     */
    static fetchGPXWeather(apiKey, gpx, distanceThreshold = 5000) {
        let tracks = gpx.trk !== undefined ? Promise.all(
            gpx.trk.map(
                (track) => {
                    // flat point index for referencing distance later
                    let pointIndex = 0;

                    return Promise.all(
                        track.trkseg.map(
                            (segment) => {
                                if (segment.trkpt.length === 0) {
                                    return [];
                                }
                                let initialIndex = pointIndex;
                                let pointPromises = [fetchWeatherAtPoint(apiKey, segment.trkpt[0]).then((result) => {
                                    return { result: result, pointIndex: initialIndex }
                                })];
                                let currentAnchor = segment.trkpt[0];

                                for (let i = 1; i < segment.trkpt.length; i++) {
                                    let point = segment.trkpt[i];
                                    let d = GPXUtil.distance([parseFloat(currentAnchor.$.lat), parseFloat(currentAnchor.$.lon)], [parseFloat(point.$.lat), parseFloat(point.$.lon)]);
                                    if (d > distanceThreshold) {
                                        let index = pointIndex + i;
                                        pointPromises.push(
                                            fetchWeatherAtPoint(apiKey, point).then((result) => {
                                                return { result: result, pointIndex: index }
                                            })
                                        );
                                        currentAnchor = point;
                                    }
                                }
                                pointIndex += segment.trkpt.length;
                                return Promise.all(pointPromises);
                            }
                        )
                    )
                }
            )
        ) : new Promise((resolve) => { resolve([]) });

        let waypoints = gpx.wpt !== undefined ? Promise.all(gpx.wpt.map(
            (point) => WeatherUtil.fetchForecast3Hour(apiKey, point.$.lon, point.$.lat)
        )) : new Promise((resolve) => { resolve([[]]) });

        let promises = Promise.all([waypoints, tracks]);
        return promises.then((data) => {
            return new GPXWeatherResult(data[0], data[1][0])
        });
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
    static distance([lat1, lon1], [lat2, lon2]) {
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


    /**
     * Calculates the total elevation for a track 
     * @param {GPX} gpx the gpx object for which the elevation is calculated
     * @returns {number} 
     */
    static calculateElevation(gpx) {
        let sum = 0;

        gpx.trk.forEach((track) => {
            let flattened = flattenTrack(track);
            for (let i = 1; i < flattened.length; i++) {
                let p1 = flattened[i - 1];
                let p2 = flattened[i];

                if (p2["ele"] > p1["ele"]) {
                    sum += parseFloat(p2["ele"]) - parseFloat(p1["ele"]);
                }
            }
        });

        return sum;
    }

}


/**
 * 
 * @param {string} apiKey the OpenWeatherMap API key.
 * @param {Waypoint} point the latitude/longitude point to fetch the data for.
 * @returns an object containing the longitude, latitude and json data from the request.
 */
function fetchWeatherAtPoint(apiKey, point) {
    return WeatherUtil.fetchForecast3Hour(apiKey, point.$.lon, point.$.lat).then(
        ({ status, response }) => {
            let json = response;
            return { lon: point.$.lon, lat: point.$.lat, json: json };
        }
    )
}

/**
 * Flattens track segments into a series of waypoints
 * 
 * @param {Track} track the track to flatten
 * @returns an array of way points
 */
function flattenTrack(track) {
    let points = [];
    track.trkseg.forEach(
        (segment) => segment.trkpt.forEach((point) => {
            points.push(point)
        })
    );

    return points;
}

function degToRad(degrees) {
    return (Math.PI / 180) * degrees;
}

