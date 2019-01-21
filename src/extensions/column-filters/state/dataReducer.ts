import {FILTER_DATA} from "./actions";
import {filterOnCol} from "../../../state/logic/datatable";
import {Data} from "../../../declarations";

export const dataReducer = (data: Data, action?: any) => {
    switch (action.type) {
        case FILTER_DATA:
            if (!action.payload.queryVal) {
                return {...data, active: data.original};
            }
            return {...data, active: filterOnCol(data.original, action.payload.key, action.payload.queryVal)};
        default:
            return data;
    }
};