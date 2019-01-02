import {defineComponent, DataTable} from "../../../src";
import Overrides from "./Overrides";

defineComponent(DataTable.componentName, DataTable, 'example');
defineComponent(Overrides.componentName, Overrides, 'example');

