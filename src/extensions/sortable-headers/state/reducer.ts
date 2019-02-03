import {SORT_DATA} from "./actions";
import {ExtendableSelectors} from "../../../modules/data-table/src/state/extendableSelectors";
import {extendSelector} from "../../../utils/extendableSelectors";
import {toggleSort} from "../logic";

export const sortReducer = (sort = { sorter: {} }, action?: any) => {
    switch (action.type) {
        case SORT_DATA:
            return {...sort, sorter: action.payload};
        default:
            return sort;
    }
};

export const getSortState = (state) => {
    return state.sort;
};

export const getSortedData = extendSelector(
    ExtendableSelectors.ACTIVE_DATA,
    getSortState,
    (data,sortState) => {
        if (!sortState || !sortState.sorter) {
            return data;
        }
        return toggleSort(data, sortState.sorter.key, sortState.sorter.order)
    },
);