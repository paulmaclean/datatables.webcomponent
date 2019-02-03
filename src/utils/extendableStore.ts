import {applyMiddleware, createStore, combineReducers} from "redux";
import reduceReducers from 'reduce-reducers';

import thunk from "redux-thunk";

let reducerRegistryItems = {};

let extendableStore = null;

export const addReducer = (reducerItem) => {
    const key = Object.keys(reducerItem)[0];

    if (reducerRegistryItems[key]) {
        reducerRegistryItems[key] = reduceReducers(reducerRegistryItems[key], reducerItem)
    } else {
        reducerRegistryItems = Object.assign(reducerItem, reducerRegistryItems);
    }

    if (!extendableStore) {
        extendableStore = makeStore(reducerRegistryItems);
    } else {
        extendableStore = updateStore(reducerRegistryItems);
    }
};

const updateStore = (reducerItems) => {
    const reducer = combineReducers(reducerItems);
    extendableStore.replaceReducer(reducer);

    return extendableStore;
};

const makeStore = (reducerItems) => {
    extendableStore = createStore(
        combineReducers(reducerItems),
        applyMiddleware(
            thunk,
        )
    );
};

export const dispatch = (action) => {
    extendableStore.dispatch(action)
};

export const getStore = () => {
    if (!extendableStore) {
        extendableStore = createStore(
            () => {
            },
            applyMiddleware(
                thunk,
            )
        );
    }
    return extendableStore;
};
