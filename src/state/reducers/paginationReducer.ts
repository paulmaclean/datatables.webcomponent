import {SET_PAGE} from "../types";
import {AppState, PaginateOpts} from "../../declarations";
import {createSelector} from 'reselect'

export const paginationReducer = (pagination: PaginateOpts, action?: any) => {
    switch (action.type) {
        case SET_PAGE:
            return {...pagination, currentPage: action.payload};
        default:
            return pagination;
    }
};


export const getPagination = (state: AppState) => {
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

export const getTotalItems = (state: AppState) => {
    return state.data.active.length;
};


export const getTotalPages = createSelector(
    getTotalItems,
    getResultsPerPage,
    (totalItems, resultsPerPage) => {
        return Math.ceil(totalItems / resultsPerPage);
    }
);
