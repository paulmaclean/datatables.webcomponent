import {CHANGE_FILTERABLE_COLUMNS, FILTER_DATA} from "./actions";
import {createSelector} from "reselect";
import {ExtendableSelectors} from "../../../modules/data-table/src/state/extendableSelectors";
import {extendSelector} from "../../../utils/extendableSelectors";
import {filterOnCol} from "../logic";
import {getHeaders} from "../../../modules/data-table/src/state/reducer";

export const reducer = (filters = {activeFilters: [], filterableColumns: []}, action?: any) => {
    switch (action.type) {
        case CHANGE_FILTERABLE_COLUMNS:
            return {...filters, filterableColumns: action.payload};
        case FILTER_DATA:
            let activeFilters = filters.activeFilters.filter((activeFilter) => {
                return activeFilter.key !== action.payload.key;
            });
            if (action.payload.queryVal) {
                return {...filters, activeFilters: [...activeFilters, action.payload]};
            }
            return {...filters, activeFilters};

        default:
            return filters;
    }
};

export const getFilters = (state) => {
    return state.filters;
};

export const getFilteredData = extendSelector(
    ExtendableSelectors.ACTIVE_DATA,
    getFilters,
    (data, filters) => {
        if (!filters || !filters.activeFilters) {
            return data
        }

        filters.activeFilters.forEach((activeFilter) => {
            data = filterOnCol(data, activeFilter.key, activeFilter.queryVal);
        });

        return data;
    }
);


export const getFilterableColumns = (state) => {
    return state.filters.filterableColumns;
};

export const getFilterableColumnHeaders = createSelector(
    getFilterableColumns,
    getHeaders,
    (filterableColumns, headers) => {

        return headers.map((header, i) => {
            if (filterableColumns && filterableColumns.indexOf(i) !== -1) {
                return header
            }
            return false;
        })
    }
);
