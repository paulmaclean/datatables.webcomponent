import {SORT_DATA} from "./actions";
import {toggleSort} from "../../../state/logic/datatable";
import {extendSelector, getExtendable} from "../../../utils/extendSelectors";
import {getActiveData} from "../../../state/reducers/dataReducer";
import {store} from "../../../state/store";

export const sortReducer = (sort: { sorter: {} }, action?: any) => {
    switch (action.type) {
        case SORT_DATA:
            return {...sort, sorter: action.payload};
        default:
            return sort;
    }
};

export const getSortedData = extendSelector(
    getActiveData,
    (data) => {
        const state = store.instance().getState();
        if (!state.sort || !state.sort.sorter) {
            return data;
        }
        return toggleSort(data, state.sort.sorter.key, state.sort.sorter.order)
    },
    'activeData'
);