import {DataTable, defineComponent} from "../../..";
import Table from "../table/Table";
import PaginationControls from "../pagination-controls/PaginationControls";

export const initDataTable = (namespace: string) => {
    defineComponent(DataTable.componentName, DataTable, namespace);
    defineComponent(Table.componentName, Table, namespace);
    defineComponent(PaginationControls.componentName, PaginationControls, namespace);
};
