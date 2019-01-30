import {compose} from "../utils/lambda";
import reduceReducers from 'reduce-reducers';


export default class Store {
    public selectors = [];

    constructor(public internalStore, public reducers: Array<any> = [], public initialState = {}) {
        this.updateReducer();
    }

    public instance() {
        return this.internalStore
    }

    public addReducer(key, reducer: Function) {
        this.reducers.push({key, reducer});
        this.updateReducer();
    }

    protected updateReducer() {
        const stateReducer = this.getStateReducer();
        this.internalStore.replaceReducer(stateReducer);
    }

    public addSelector(selectorObj: any) {
        const name = Object.keys(selectorObj)[0];

        this.selectors[name] = selectorObj[name];
    }

    public applySelectors(selectorKey, selection) {
        console.log(this.selectors)
        if(this.selectors[selectorKey]){
            this.selectors[selectorKey](selection);
        }

        return selection;
    }

    public dispatch(action) {
        this.internalStore.dispatch(action);
    }

    public getStateReducer() {
        const groupedReducer = this.groupBy(this.reducers, 'key');
        Object.keys(groupedReducer).forEach((key) => {
            const reducers = groupedReducer[key].map((reducerItem) => {
                return reducerItem.reducer
            });
            groupedReducer[key] = reduceReducers(...reducers)
        });

        return (state = this.initialState, action?: any) => {
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
