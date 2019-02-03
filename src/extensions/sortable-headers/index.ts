import SortableHeaders from "./components/SortableHeaders";
import {sortReducer} from "./state/reducer";
import {addReducer} from "../../utils/extendableStore";
import {defineComponent} from "../../utils/component";

export const initSortableHeaders = (namespace: string) => {
    addReducer({'sort': sortReducer});
    defineComponent(SortableHeaders.componentName, SortableHeaders, namespace);
};

