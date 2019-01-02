import {defineComponent, DataTable} from "../../src";
import Overrides from "./App";

defineComponent(DataTable.componentName, DataTable, 'example');
defineComponent(Overrides.componentName, Overrides, 'example');

