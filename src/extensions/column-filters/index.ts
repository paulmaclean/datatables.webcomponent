import {store} from "../../state/store";
import {filtersReducer} from "./state/filtersReducer";
import {defineComponent} from "../..";
import ColumnFilters from "./components/ColumnFilters";
import {dataReducer} from "./state/dataReducer";

export const initColumnFilters = (namespace: string) => {
    store.addReducer('data', dataReducer);
    store.addReducer('filters', filtersReducer);
    defineComponent(ColumnFilters.componentName, ColumnFilters, namespace);
};

