
export class WeatherUtil {
    static fetchJSON(url, params) {
        return fetch(url + "?" + new URLSearchParams(params), { method: "GET" }).then(response => response.json().then((data) => { return {status: response.status, response: data}}));
    }

    static fetchForecast3Hour(apiKey, longitude, latitude) {
        return this.fetchJSON("http://api.openweathermap.org/data/2.5/forecast", { lat: latitude, lon: longitude, appid: apiKey });
    }

    static fetchForecast1Hour(apiKey, longitude, latitude, count) {
        return this.fetchJSON("https://pro.openweathermap.org/data/2.5/forecast/hourly", { lat: latitude, lon: longitude, appid: apiKey, cnt: count });
    }

    static fetchLocationData(apiKey, cityName, limit) {
        return this.fetchJSON("http://api.openweathermap.org/geo/1.0/direct", { q: cityName, limit: limit, appid: apiKey });
    }

    static kelvinToCelcius(kelvin) {
        return kelvin - 272.15;
    }

    static kelvinToFarenheit(kelvin) {
        return WeatherUtil.kelvinToCelcius(kelvin) * 1.8 + 32.;
    }

    static parseKelvin(kelvin, converter) {
        return Math.trunc(converter(parseFloat(kelvin)));
    }

    static getIconURL(iconId) {
        return "https://openweathermap.org/img/wn/" + iconId + ".png";
    }

    static getDayString(dayIndex) {
        return ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];
    }
}
