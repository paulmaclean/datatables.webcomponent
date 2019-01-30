import {defineComponent} from "../..";
import {store} from "../../state/store";
import SortableHeaders from "./components/SortableHeaders";
import {sortReducer} from "./state/reducer";

export const initSortableHeaders = (namespace: string) => {
    store.addReducer('sort', sortReducer);
    defineComponent(SortableHeaders.componentName, SortableHeaders, namespace);
};

