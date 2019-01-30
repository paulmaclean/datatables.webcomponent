import {CHANGE_FILTERABLE_COLUMNS, FILTER_DATA} from "./actions";
import {createSelector} from "reselect";
import {getActiveData, getHeaders} from "../../../state/reducers/dataReducer";
import {filterOnCol} from "../../../state/logic/datatable";
import {extendSelector} from "../../../utils/extendSelectors";
import {store} from "../../../state/store";

export const filtersReducer = (filters = {activeFilters: [], filterableColumns: []}, action?: any) => {
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

export const getFilteredData = extendSelector(
    getActiveData,
    (data) => {
        const state = store.instance().getState();
        if (!state.filters || !state.filters.activeFilters) {
            return state.data
        }

        state.filters.activeFilters.forEach((activeFilter) => {
            data = filterOnCol(data, activeFilter.key, activeFilter.queryVal);
        });

        return data;
    },
    'activeData'
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
