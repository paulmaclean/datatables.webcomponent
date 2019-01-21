import {RECEIVE_DATA} from "../types";
import {AppState, Data, PaginateOpts} from "../../declarations";
import {collectionToValues} from "../../utils/array";
import {getPageSlice} from "../logic/datatable";
import {createSelector} from "reselect";
import {getPagination} from "./paginationReducer";

export const dataReducer = (data: Data, action?: any) => {
    switch (action.type) {
        case RECEIVE_DATA:
            return {...data, active: action.payload, original: action.payload};
        default:
            return data;
    }
};

export const getData = (state: AppState) => {
    return state.data.active;
};

export const getOriginalData = (state: AppState) => {
    return state.data.original;
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

export const getRows = createSelector(
    getData,
    getPagination,
    (data: Array<any>, pagination: PaginateOpts) => {
        const rows = collectionToValues(data);
        if (pagination && pagination.enabled) {
            return getPageSlice(rows, pagination.currentPage, pagination.resultsPerPage)
        }

        return rows;
    }
);

export const getTotalItems = createSelector(
    getData,
    (data: Array<any>) => {
        return data.length
    }
);

export const getTotalActiveItems = createSelector(
    getRows,
    (rows: Array<any>) => {
        return rows.length
    }
);