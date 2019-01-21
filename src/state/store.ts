import {applyMiddleware, createStore} from "redux";
import reduceReducers from 'reduce-reducers';
import thunk from 'redux-thunk';
import {AppState, ReducerMap} from "../declarations";
import {dataReducer} from "./reducers/dataReducer";
import {paginationReducer} from "./reducers/paginationReducer";

class Store {
    public reducers = [];
    public reduxStore;

    constructor(reducers: Array<ReducerMap>) {
        this.reducers = reducers;
        this.reduxStore = createStore(
            this.getStateReducer(),
            applyMiddleware(
                thunk,
            )
        )
    }

    public instance() {
        return this.reduxStore
    }

    public addReducer(key, reducer: Function) {
        this.reducers.push({key, reducer});
        const stateReducer = this.getStateReducer();
        this.reduxStore.replaceReducer(stateReducer);
    }

    public dispatch(action) {
        this.reduxStore.dispatch(action);
    }

    public getStateReducer() {
        const groupedReducer = this.groupBy(this.reducers, 'key');
        Object.keys(groupedReducer).forEach((key) => {
            const reducers = groupedReducer[key].map((reducerItem) => {
                return reducerItem.reducer
            });
            groupedReducer[key] = reduceReducers(...reducers)
        });

        return (state: AppState = initialState, action?: any) => {
            const reducerObj = {};
            Object.keys(groupedReducer).forEach((key) => {
                reducerObj[key] = groupedReducer[key](state[key], action)
            });

            return reducerObj;
        };
    }

    groupBy(arr, property) {
        return arr.reduce(function (memo, x) {
            if (!memo[x[property]]) {
                memo[x[property]] = [];
            }
            memo[x[property]].push(x);
            return memo;
        }, {});
    }

}

const initialState: AppState = {
    data: {
        original: [],
        active: []
    },
    pagination: {
        enabled: true,
        currentPage: 1,
        perPageOptions: [5, 10, 20, 100],
        resultsPerPage: 10
    }
};


const store = new Store([
    {key: 'data', reducer: dataReducer},
    {key: 'pagination', reducer: paginationReducer}
]);

export {store};