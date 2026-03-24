import GPX from "gpx-parser-builder";

function loadGPX(gpxString) {
    return GPX.parse(gpxString);
}