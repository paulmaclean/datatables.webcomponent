import {defineComponent, DataTable, Pagination, Search} from "../../src";
import App from "./App";
import PerPageSelector from "../../src/components/per-page-selector/PerPageSelector";
import ExportButtons from "../../src/components/export-buttons/ExportButtons";
import Table from "../../src/components/table/Table";

defineComponent(DataTable.componentName, DataTable, 'example');
defineComponent(Pagination.componentName, Pagination, 'data-table');
defineComponent(Search.componentName, Search, 'data-table');
defineComponent(PerPageSelector.componentName, PerPageSelector, 'data-table');
defineComponent(ExportButtons.componentName, ExportButtons, 'data-table');
defineComponent(Table.componentName, Table, 'data-table');
defineComponent(App.componentName, App, 'example');

