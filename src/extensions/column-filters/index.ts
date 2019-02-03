import {reducer} from "./state/reducer";
import ColumnFilters from "./components/ColumnFilters";
import {addReducer} from "../../utils/extendableStore";
import {defineComponent} from "../../utils/component";

export const initColumnFilters = (namespace: string) => {
    addReducer({'filters': reducer});
    defineComponent(ColumnFilters.componentName, ColumnFilters, namespace);
};

