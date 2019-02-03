import {RECEIVE_DATA} from "./types";
import {AppState} from "../declarations";
import {createSelector} from "reselect";
import {createExtendableSelector} from "../../../../utils/extendableSelectors";
import {collectionToValues} from "../../../../utils/array";
import {ExtendableSelectors} from "./extendableSelectors";


export const reducer = (data = [], action?: any) => {
    switch (action.type) {
        case RECEIVE_DATA:
            return action.payload;
        default:
            return data;
    }
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

export const getActiveData = createExtendableSelector(
    ExtendableSelectors.ACTIVE_DATA,
    createSelector(
        getData,
        (data) => {
            return data;
        }
    )
);

export const getRows = createExtendableSelector(
    ExtendableSelectors.ROWS,
    createSelector(
        getActiveData,
        (data) => {
            return collectionToValues(data);
        }
    )
);