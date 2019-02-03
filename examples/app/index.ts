// import {initSortableHeaders} from "../../src/extensions/sortable-headers";
// import {initDataTable} from "../../src/components/containers/data-table";
// import {defineComponent} from "../../src";
import App from "./App";
import {initDataTable} from "../../src/modules/data-table/src";
import {defineComponent} from "../../src/utils/component";
import {initSearch} from "../../src/extensions/search";
import {initPagination} from "../../src/extensions/pagination";
import {initColumnFilters} from "../../src/extensions/column-filters";
import {initSortableHeaders} from "../../src/extensions/sortable-headers";

initDataTable('example');
initColumnFilters('example');
initSortableHeaders('example');
initSearch('example');
initPagination('example')
defineComponent(App.componentName, App, 'example');
