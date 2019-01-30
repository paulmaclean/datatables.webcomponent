import {initSortableHeaders} from "../../src/extensions/sortable-headers";
import {initDataTable} from "../../src/components/containers/data-table";
import {defineComponent} from "../../src";
import App from "./App";
import {initColumnFilters} from "../../src/extensions/column-filters";
import {initSearch} from "../../src/extensions/search";
import {initPagination} from "../../src/extensions/pagination";

initSortableHeaders('example');
initColumnFilters('example');
initSearch('example');
initDataTable('example');
initPagination('example')
defineComponent(App.componentName, App, 'example');
