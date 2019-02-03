import {defineComponent} from "../../../utils/component";
import DataTable from "./components/data-table/DataTable";
import Table from "./components/table/Table";
import {addReducer} from "../../../utils/extendableStore";
import {reducer} from "./state/reducer";

export const initDataTable = (namespace: string) => {
    addReducer({data: reducer});

    defineComponent(DataTable.componentName, DataTable, namespace);
    defineComponent(Table.componentName, Table, namespace);
};
