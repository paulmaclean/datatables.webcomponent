import {values, isEqual} from "lodash";
import {isObject} from "./object";

export const collectionToValues = (collection) => {
    if(!collection || !collection.length) return [];
    return collection.map((item) => {
        return values(item);
    });
};

export const isCollection = (data) => {
    if (!data.length) return true;
    if(!isObject(data[0])) return false;

    const headers = Object.keys(data[0]);

    for (let i in data) {
        if (!isEqual(Object.keys(data[i]), headers)) {
            return false;
        }
    }

    return true;
};

export const flatten = (arr) => {
    const flat = [];
    Object.keys(arr).forEach(key => {
        flat.push(arr[key])
    });
    return flat;
};