import {defineComponent} from "../../src";
import DataTable from "../../src/component/DataTable";
DataTable.renderRoot = 'light-dom';

defineComponent(DataTable.componentName, DataTable, 'example');

