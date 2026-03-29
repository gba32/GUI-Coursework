/**
 * Writes a string to a function only on the first invocation, or first invocation after reset
 */
export function writeOnce(key, value) {
    if(sessionStorage.getItem(key + "_set") === null) {
        sessionStorage.setItem(key + "_set", "");
        sessionStorage.setItem(key, value);
    }
}

export function read(key) {
    return sessionStorage.getItem(key);
}

export function reset(key) {
    sessionStorage.removeItem(key + "_set");
}