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
     * @param {string} key 
     * @returns The session value for the given key, or null if it does not exist
     */
    static read(key) {
        return localStorage.getItem(key);
    }

    /**
     * Resets a key from session storage so that it can be written to again
     * @param {string} key 
     */
    static reset(key) {
        localStorage.removeItem(key + "_set");
    }
}