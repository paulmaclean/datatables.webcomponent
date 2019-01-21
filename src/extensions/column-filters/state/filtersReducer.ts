import {CHANGE_FILTERABLE_COLUMNS, FILTER_DATA} from "./actions";
import {createSelector} from "reselect";
import {getHeaders} from "../../../state/reducers/dataReducer";

export const filtersReducer = (filters: [], action?: any) => {
    switch (action.type) {
        case CHANGE_FILTERABLE_COLUMNS:
            return action.payload;
        default:
            return filters;
    }
};

export const getColsToFilter = (state) => {
    return state.filters;
};

export const getFilters = createSelector(
    getColsToFilter,
    getHeaders,
    (colsToFilter, headers) => {
        return headers.map((header, i) => {
            if (colsToFilter && colsToFilter.indexOf(i) !== -1) {
                return header
            }
            return false;
        })
    }
);