export default class StorageUtil {
    /*
     * Writes a string to a function only on the first invocation, or first invocation after reset
     */
    static writeOnce(key, value) {
        if (sessionStorage.getItem(key + "_set") === null) {
            sessionStorage.setItem(key + "_set", "");
            sessionStorage.setItem(key, value);
        }
    }

    /**
     * @param {string} key 
     * @returns The session value for the given key, or null if it does not exist
     */
    static read(key) {
        return sessionStorage.getItem(key);
    }

    /**
     * Resets a key from session storage so that it can be written to again
     * @param {string} key 
     */
    static reset(key) {
        sessionStorage.removeItem(key + "_set");
    }
}