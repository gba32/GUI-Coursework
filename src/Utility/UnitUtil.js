const METERS_PER_MILE = 1609.344;
const METERS_PER_KM = 1000;
const SECONDS_PER_HOUR = 60.0 * 60;

export const SPEED_UNITS = {
    MS: 0,
    MPH: 1,
    KPH: 2,
}

export const TEMP_UNITS = {
    KELVIN: 0, 
    CELCIUS: 1,
    FAHRENHEIT: 2
}

// stores value of each unit in m/s
const SPEED_SCALES = [1, METERS_PER_MILE / SECONDS_PER_HOUR, METERS_PER_KM / SECONDS_PER_HOUR];
const SPEED_UNIT_STRINGS = ["m/s", "mph", "kph"];

// Stores scale and offset relative to kelvin scale
const TEMP_UNIT_PRE_OFFSETS = [0, -273.15, -273.15];
const TEMP_UNIT_SCALES = [1, 1, 1.8]
const TEMP_UNIT_POST_OFFSETS = [0, 0, 32];




export class UnitUtil {
    static round(value, dp = 2) {
        let multiplier = Math.pow(10, dp);
        return Math.round(multiplier * value) / multiplier;
    }
}

export class SpeedUnit {
    static convert(value, from, to) {
        return (value / SPEED_SCALES[from]) * SPEED_SCALES[to]
    }

    static getUnitString(unit) {
        return SPEED_UNIT_STRINGS[unit];
    }
    
}

export class TempUnit {
    static convert(value, from, to) {
        let kelvin = (value - TEMP_UNIT_POST_OFFSETS[from])/TEMP_UNIT_SCALES[from] + TEMP_UNIT_PRE_OFFSETS[from];
        return (kelvin + TEMP_UNIT_PRE_OFFSETS[to]) * TEMP_UNIT_SCALES[to] + TEMP_UNIT_POST_OFFSETS[to];
    }
}