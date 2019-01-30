import {createSelector} from 'reselect'
import {PaginateOpts} from "../declarations";
import {SET_PAGE, SET_RESULTS_PER_PAGE} from "./actions";
import {getPageSlice} from "../../../state/logic/datatable";
import {getActiveData, getRows} from "../../../state/reducers/dataReducer";
import {extendSelector, getExtendable} from "../../../utils/extendSelectors";
import {store} from "../../../state/store";

const initialState: PaginateOpts = {
    currentPage: 1,
    perPageOptions: [5, 10, 15, 20],
    resultsPerPage: 10
};

export const paginationReducer = (pagination: PaginateOpts = initialState, action?: any) => {
    switch (action.type) {
        case SET_PAGE:
            return {...pagination, currentPage: action.payload};
        case SET_RESULTS_PER_PAGE:
            return {...pagination, resultsPerPage: action.payload};
        default:
            return pagination;
    }
};

export const getPaginatedRows = extendSelector(
    getRows,
    (rows) => {
        const state = store.instance().getState();
        return getPageSlice(rows, parseInt(state.pagination.currentPage), parseInt(state.pagination.resultsPerPage))
    },
    'rows'
);

export const getPagination = (state) => {
    return state.pagination;
};

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
    getExtendable(getActiveData, 'activeData'),
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
    getExtendable(getRows, 'rows'),
    (paginatedRows: Array<any>) => {
        return paginatedRows.length;
    }
);
