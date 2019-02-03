import {searchReducer} from "./state/reducer";
import Search from "./components/Search";
import {addReducer} from "../../utils/extendableStore";
import {defineComponent} from "../../utils/component";

export const initSearch = (namespace: string) => {
    addReducer({'search': searchReducer});
    defineComponent(Search.componentName, Search, namespace);
};

