import {SORT_DATA} from "./actions";
import {toggleSort} from "../../../state/logic/datatable";
import {Data} from "../../../declarations";

export const dataReducer = (data: Data, action?: any) => {
    switch (action.type) {
        case SORT_DATA:
            return {...data, active: toggleSort(data.active, action.payload.key, action.payload.order)};
        default:
            return data;
    }
};