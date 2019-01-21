import {dataReducer} from "./state/reducer";
import {defineComponent} from "../..";
import {store} from "../../state/store";
import SortableHeaders from "./components/SortableHeaders";


export const initSortableHeaders = (namespace: string) => {
    store.addReducer('data', dataReducer);
    defineComponent(SortableHeaders.componentName, SortableHeaders, namespace);
};

