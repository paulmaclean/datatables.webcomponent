import {createSelector} from 'reselect'
import {PaginateOpts} from "../declarations";
import {SET_PAGE, SET_RESULTS_PER_PAGE} from "./actions";
import {extendSelector} from "../../../utils/extendableSelectors";
import {ExtendableSelectors} from "../../../modules/data-table/src/state/extendableSelectors";
import {getPageSlice} from "../logic";
import {getActiveData, getRows} from "../../../modules/data-table/src/state/reducer";

const initialState: PaginateOpts = {
    currentPage: 1,
    perPageOptions: [5, 10, 15, 20],
    resultsPerPage: 10
};

export const reducer = (pagination: PaginateOpts = initialState, action?: any) => {
    switch (action.type) {
        case SET_PAGE:
            return {...pagination, currentPage: action.payload};
        case SET_RESULTS_PER_PAGE:
            return {...pagination, resultsPerPage: action.payload};
        default:
            return pagination;
    }
};

export const getPagination = (state) => {
    return state.pagination;
};

export const getPaginatedRows = extendSelector(
    ExtendableSelectors.ROWS,
    getPagination,
    (rows, pagination) => {
        return getPageSlice(rows, parseInt(pagination.currentPage), parseInt(pagination.resultsPerPage))
    }
);

export const getCurrentPage = createSelector(
    getPagination,
    (pagination: PaginateOpts) => {
        return pagination.currentPage
    }
);

export const getResultsPerPage = createSelector(
    getPagination,
    (pagination: PaginateOpts) => {
        return pagination.resultsPerPage
    }
);

export const getPerPageOptions = createSelector(
    getPagination,
    (pagination: PaginateOpts) => {
        return pagination.perPageOptions
    }
);

export const getTotalItems = createSelector(
    getActiveData,
    (activeData: Array<any>) => {
        return activeData.length ? activeData.length : 1
    }
);

export const getTotalPages = createSelector(
    getTotalItems,
    getResultsPerPage,
    (totalItems, resultsPerPage) => {
        return Math.ceil(totalItems / resultsPerPage);
    }
);

export const getTotalRows = createSelector(
    getRows,
    (paginatedRows: Array<any>) => {
        return paginatedRows.length;
    }
);
