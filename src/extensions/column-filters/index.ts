import {store} from "../../state/store";
import {filtersReducer} from "./state/filtersReducer";
import {defineComponent} from "../..";
import ColumnFilters from "./components/ColumnFilters";

export const initColumnFilters = (namespace: string) => {
    store.addReducer('filters', filtersReducer);
    defineComponent(ColumnFilters.componentName, ColumnFilters, namespace);
};

