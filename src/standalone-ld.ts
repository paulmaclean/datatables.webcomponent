import {defineComponent} from "./utils/component";
import DataTable from "./component/DataTable";
DataTable.renderRoot = 'light-dom';
defineComponent(DataTable.componentName, DataTable, 'pmac');