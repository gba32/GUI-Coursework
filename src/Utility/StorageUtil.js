/**
 * Collection of local storage keys 
 */
export const STORAGE_KEY = {
    TEMP: "TEMP_UNIT",
    WIND: "WIND_UNIT",
    DIST: "DIST_UNIT",
    GPX: "GPX_DATA"
}

export default class StorageUtil {
    /*
     * Writes a string to a function only on the first invocation, or first invocation after reset
     */
    static writeOnce(key, value) {
        if (localStorage.getItem(key + "_set") === null) {
            localStorage.setItem(key + "_set", "");
            localStorage.setItem(key, value);
        }
    }

    /**
     * @param {string} key the identifier of the data in storage.
     * @param {*} defaultValue the value to return if the data is not found.
     * @returns The session value for the given key, or null if it does not exist
     */
    static read(key, defaultValue = null) {
        let value = localStorage.getItem(key);

        return value === null ? defaultValue : value;
    }

    /**
     * Resets a key from session storage so that it can be written to again
     * @param {string} key 
     */
    static reset(key) {
        localStorage.removeItem(key + "_set");
        localStorage.removeItem(key);
    }
}