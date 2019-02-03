import {reducer} from "./state/reducer";
import Pagination from "./components/PaginationControls";
import PerPageSelector from "./components/PerPageSelector";
import {addReducer} from "../../utils/extendableStore";
import {defineComponent} from "../../utils/component";

export const initPagination = (namespace: string) => {
    addReducer({pagination: reducer});
    defineComponent(Pagination.componentName, Pagination, namespace);
    defineComponent(PerPageSelector.componentName, PerPageSelector, namespace);
};

