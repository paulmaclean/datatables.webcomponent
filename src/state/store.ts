import {AppState} from "../declarations";
import {dataReducer, getRows} from "./reducers/dataReducer";
import Store from "../store/Store";
import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import {compound, pipe, pipeWithParam} from "../utils/lambda";
import {RECEIVE_DATA} from "./types";

const initialState: AppState = {
    data: [],
    pagination: {
        enabled: true,
        currentPage: 1,
        perPageOptions: [5, 10, 20, 100],
        resultsPerPage: 10
    }
};

const reduxStore = createStore(
    () => {},
    applyMiddleware(
        thunk,
    )
);


const store = new Store(
    reduxStore,
    [
        {key: 'data', reducer: dataReducer},
    ],
    initialState);

//store.addSelector({getRows});

export const extendSelector = (original, extension) => {
    // const originalName = Object.keys(original)[0];
    // const originalSelector = original[originalName];
    // console.log(original, extension)
    // const selector = pipeWithParam(originalSelector, store.instance().getState, extension);
    // const selectorObj = [];
    // selectorObj[originalName] = selector;
    // store.addSelector(selectorObj);
    //
    return original
};

export {store};