import {store} from "../../state/store";
import {defineComponent} from "../..";
import {getActiveData, searchReducer} from "./state/dataReducer";
import Search from "./components/Search";

export const initSearch = (namespace: string) => {
    store.addReducer('search', searchReducer);
    store.addSelector({getActiveData});
    defineComponent(Search.componentName, Search, namespace);
};

