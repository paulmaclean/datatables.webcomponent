import {initSortableHeaders} from "../../src/extensions/sortable-headers";
import {initDataTable} from "../../src/components/containers/data-table";
import {defineComponent} from "../../src";
import App from "./App";
import {initColumnFilters} from "../../src/extensions/column-filters";

initSortableHeaders('example');
initColumnFilters('example');
initDataTable('example');
defineComponent(App.componentName, App, 'example');
