import {values, isEqual} from "lodash";
import {isObject} from "./object";

export const collectionToValues = (collection) => {
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