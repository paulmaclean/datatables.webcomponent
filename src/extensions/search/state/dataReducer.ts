import {searchData} from "../../../state/logic/datatable";
import {SEARCH_DATA} from "./actions";
import {extendSelector} from "../../../utils/extendSelectors";
import {getActiveData} from "../../../state/reducers/dataReducer";
import {store} from "../../../state/store";

export const searchReducer = (search = { queryVal: '' }, action?: any) => {
    switch (action.type) {
        case SEARCH_DATA:
            return {...search, queryVal: action.payload.queryVal};
        default:
            return search;
    }
};

export const getSearchedData = extendSelector(
    getActiveData,
    (data) => {
        const state = store.instance().getState();
        if (!state.search || !state.search.queryVal) {
            return data
        }

        return searchData(data, state.search.queryVal);
    },
    'activeData'
);