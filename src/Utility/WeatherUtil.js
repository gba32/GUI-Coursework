
export class WeatherUtil {
    /**
     * Fetches json data from a given location.
     * 
     * @param {*} url location to fetch from
     * @param {*} params GET parameters for request
     * @returns status and json data
     */
    static fetchJSON(url, params) {
        return fetch(url + "?" + new URLSearchParams(params), { method: "GET" }).then(response => response.json().then((data) => { return { status: response.status, response: data } }));
    }

    /**
     * Fetches 3 hour forecast for the next 5 days from the OpenWeatherMap API
     * @param {*} apiKey the OpenWeatherMap API key
     * @param {*} longitude the longitude of the point to get forecast data for
     * @param {*} latitude the latitude of the point to get forecast data for
     * @returns 
     */
    static fetchForecast3Hour(apiKey, longitude, latitude) {
        return this.fetchJSON("http://api.openweathermap.org/data/2.5/forecast", { lat: latitude, lon: longitude, appid: apiKey });
    }

    /**
     * Fetches 1 hour forecast from the OpenWeatherMap API.
     * @param {string} apiKey the OpenWeatherMap API key.
     * @param {number} longitude the longitude of the point to get forecast data for.
     * @param {number} latitude  the latitude of the point to get forecast data for.
     * @param {number} count the number of hours to fetch forecast data for.
     * @returns 
     */
    static fetchForecast1Hour(apiKey, longitude, latitude, count) {
        return this.fetchJSON("https://pro.openweathermap.org/data/2.5/forecast/hourly", { lat: latitude, lon: longitude, appid: apiKey, cnt: count });
    }

    /**
     * Fetches Geocoding data for a given city.
     * 
     * @param {string} apiKey the OpenWeatherMap API key.
     * @param {string} cityName the name of the city to get the geocoding data for.
     * @param {number} limit the maximum number of responses.
     * @returns 
     */
    static fetchLocationData(apiKey, cityName, limit) {
        return this.fetchJSON("http://api.openweathermap.org/geo/1.0/direct", { q: cityName, limit: limit, appid: apiKey });
    }

    /**
     * @param {string} iconId The weather icon id.
     * @returns {string} the url for the icon asset.
     */
    static getIconURL(iconId) {
        return "https://openweathermap.org/img/wn/" + iconId + ".png";
    }
}
