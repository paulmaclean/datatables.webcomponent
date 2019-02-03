import {Filter} from "../declarations";
import {map, uniqBy} from "lodash";

export const isSelectedFilter = (filters: Array<Filter>, key: string) => {
    return filters.find((item) => {
        return item.queryVal !== null && item.queryVal !== '' && item.key === key;
    })
};

export const uniqueValuesInCol = (data: Array<any>, key: string) => {
    return map(uniqBy(data, key), key).sort();
};

export const filterOnCol = (data: Array<any>, key: string, queryVal: string) => {
    if (!queryVal) {
        return data;
    }

    return data.filter((item) => {
        return item[key] == queryVal;
    });
};


