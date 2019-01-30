import {DataTable, defineComponent} from "../../..";
import Table from "../table/Table";

export const initDataTable = (namespace: string) => {
    defineComponent(DataTable.componentName, DataTable, namespace);
    defineComponent(Table.componentName, Table, namespace);
};
