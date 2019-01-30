import {store} from "../../state/store";
import {defineComponent} from "../..";
import {paginationReducer} from "./state/paginationReducer";
import Pagination from "./components/PaginationControls";
import PerPageSelector from "./components/PerPageSelector";

export const initPagination = (namespace: string) => {
    store.addReducer('pagination', paginationReducer);
    defineComponent(Pagination.componentName, Pagination, namespace);
    defineComponent(PerPageSelector.componentName, PerPageSelector, namespace);
};

