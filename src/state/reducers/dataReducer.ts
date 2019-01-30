import {RECEIVE_DATA} from "../types";
import {AppState} from "../../declarations";
import {collectionToValues} from "../../utils/array";
import {createSelector} from "reselect";
import {getExtendable} from "../../utils/extendSelectors";

export const dataReducer = (data = [], action?: any) => {
    switch (action.type) {
        case RECEIVE_DATA:
            return action.payload;
        default:
            return data;
    }
};

export const getActiveData = (state: AppState) => {
    return state.data
};

export const getData = (state: AppState) => {
    return state.data;
};

export const getHeaders = createSelector(
    getData,
    (data: Array<any>) => {
        if (data && data[0]) {
            return Object.keys(data[0]);
        }
        return [];
    }
);

export const getRows = (state) => {
    const data = getExtendable(getActiveData, 'activeData')(state);
    return collectionToValues(data)
};