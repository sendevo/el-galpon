import moment from "moment";
import {
    DEBUG_MODE,
    AVAILABLE_DEBUG_MODES,
    MONTHS
} from "../model/constants.js";

export const compare = (value1, value2, operator) => {
    switch (operator) {
        case "eq":
            return value1 === value2;
        case "neq":
            return value1 !== value2;
        case "gt":
            return value1 > value2;
        case "lt":
            return value1 < value2;
        default:
            console.log("Invalid operator: ", operator);
            return false;
    }
};

export const queryString2Filters = (queryString) => {
    const urlParams = new URLSearchParams(queryString);
    let filters = [];
    urlParams.forEach((_, param) => {
        const [key, operator, value] = param.split(':');
        const parsed = { key, operator, value };
        filters.push(parsed);
    });
    return filters;
};

export const arraySum = (arr, attr = "") => arr.reduce((a, b) => a + (attr ? b[attr] : b), 0);

export const round2 = num => Math.round(num * 100) / 100;

const hsv2rgb = (h, s, v) => {
    let f = (n, k = (n + h / 60) % 6) => v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
    return [f(5) * 255, f(3) * 255, f(1) * 255];
};

export const colorRangeGenerator = (count, hue, satFrom = 0.1, satTo = 0.9, transparency = 0.7) => {
    const colors = [];
    const step = (satTo - satFrom) / count;
    for (let s = satFrom; s < satTo; s += step) {
        const [r, g, b] = h > sv2rgb(hue, s, 0.9);
        colors.push(`rgba(${r}, ${g}, ${b}, ${transparency})`);
    }
    return colors;
};

export const stringEncode = str => {
    if (str.length === 0) return "";
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
    }
    return String(hash).replace(/-/g, '0').replace(/^-/, '');
};

export const generateUUID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

export const trimString = (name, maxChars) => name.substring(0,maxChars)+(name.length > 30 ? "..." : "");

export const categories2Select = cats => cats?.map(c => ({label: c, key: stringEncode(c)}));
  
export const randomColorsGenerator = (count, transparency = 0.7) => {
    const colors = [];
    for (let c = 0; c < count; c++) {
        const [r, g, b] = [
            Math.floor(Math.random() * 156 + 100),
            Math.floor(Math.random() * 156 + 100),
            Math.floor(Math.random() * 156 + 100)
        ];
        colors.push(`rgba(${r}, ${g}, ${b}, ${transparency})`);
    }
    return colors;
};

export const colorMapGenerator = (values, hue, satFrom = 0.1, satTo = 0.9, transparency = 0.7) => {
    const maxValue = Math.max(...values);
    return values.map(v => {
        const s = v / maxValue * (satTo - satFrom) + satFrom;
        const [r, g, b] = hsv2rgb(hue, s, 0.9);
        return `rgba(${r}, ${g}, ${b}, ${transparency})`;
    });
};

export const latLng2GoogleMap = (lat, lng) => `http://www.google.com/maps/place/${lat},${lng}`;

export const googleMap2LatLng = url => {
    // Example 1 https://www.google.com.ar/maps/@-38.7919835,-62.1916723,9.88z?entry=ttu
    const regex = /\/@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = url.match(regex);
    let latitude, longitude;
    if (match) {
        latitude = parseFloat(match[1]);
        longitude = parseFloat(match[2]);
    }

    // Example 2 http://www.google.com/maps/place/-39.363867,-62.685075
    const regex2 = /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match2 = url.match(regex2);
    if (match2) {
        latitude = parseFloat(match2[1]);
        longitude = parseFloat(match2[2]);
    }

    return (latitude && longitude) ? { latitude, longitude } : null;
};

export const dms2LatLng = (dms) => {
    const dmsRegex = /(\d+)°(\d+)'([\d.]+)"([NS])\s+(\d+)°(\d+)'([\d.]+)"([EW])/;
                     
    const match = dms.match(dmsRegex);

    if (!match)
        return null;

    const latDegrees = parseInt(match[1]);
    const latMinutes = parseInt(match[2]);
    const latSeconds = parseFloat(match[3]);
    const latDirection = match[4];

    const lonDegrees = parseInt(match[5]);
    const lonMinutes = parseInt(match[6]);
    const lonSeconds = parseFloat(match[7]);
    const lonDirection = match[8];

    let latitude = latDegrees + (latMinutes / 60) + (latSeconds / 3600);
    let longitude = lonDegrees + (lonMinutes / 60) + (lonSeconds / 3600);

    // Apply negative sign for south and west coordinates
    if (latDirection === 'S')
        latitude = -latitude;
    if (lonDirection === 'W')
        longitude = -longitude;

    return { latitude, longitude };
};

export const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const cropString = (str, len=10) => str.slice(0, len) + (str.length > len ? "..." : "");

export const formatDate = d => {
    const m = moment(d);
    return `${m.date()} de ${MONTHS[m.month()]} de ${m.year()}`;
};

export const levenshteinDistance = (str1, str2) => {
    const a = str1.toUpperCase();
    const b = str2.toUpperCase();
    const m = a.length;
    const n = b.length;
    const dp = Array.from({length: m + 1}, () => Array(n + 1).fill(0));

    for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
            if(i === 0) 
                dp[i][j] = j;
            else if(j === 0) 
                dp[i][j] = i;
            else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1] + (a[i - 1] !== b[j - 1] ? 1 : 0),
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1
                );
            }
        }
    }

    return dp[m][n];
};

export const debug = (message, type = "log") => {
    if (DEBUG_MODE){
        if (AVAILABLE_DEBUG_MODES.includes(type))
            console[type](message);
    }
};