import {SEARCH_DATA} from "./actions";
import {extendSelector} from "../../../utils/extendableSelectors";
import {ExtendableSelectors} from "../../../modules/data-table/src/state/extendableSelectors";
import {searchData} from "../logic";

export const searchReducer = (search = {queryVal: ''}, action?: any) => {
    switch (action.type) {
        case SEARCH_DATA:
            return {...search, queryVal: action.payload.queryVal};
        default:
            return search;
    }
};

export const getSearchState = (state) => {
    return state.search;
};

export const getSearchedData = extendSelector(
    ExtendableSelectors.ACTIVE_DATA,
    getSearchState,
    (activeData, searchState) => {

        if (!searchState || !searchState.queryVal) {
            return activeData
        }

        return searchData(activeData, searchState.queryVal);

    }
);