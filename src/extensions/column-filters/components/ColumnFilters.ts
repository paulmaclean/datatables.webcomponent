import {LitElement, html, property} from "@polymer/lit-element";
import psuedoTable from "../../../shared/psuedo-table.css"
import {connect} from "pwa-helpers/connect-mixin";
import {store} from "../../../state/store";
import {getData} from "../../../state/reducers/dataReducer";
import {defineComponent} from "../../..";
import {changeFilterableColumns} from "../state/actions";
import {getFilterableColumnHeaders} from "../state/filtersReducer";
import {uniqueValuesInCol} from "../../../state/logic/datatable";
import ColumnFilter from "./ColumnFilter";


export default class ColumnFilters extends connect(store.instance())(LitElement) {
    public static componentName = 'column-filters';

    @property({type: Array})
    filterableColumnHeaders: Array<any>;

    @property({type: Array})
    filterableColumns: Array<any>;

    @property({type: Array})
    data: Array<any>;


    stateChanged(state) {
        this.data = getData(state);
        this.filterableColumnHeaders = getFilterableColumnHeaders(state);
    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super['connectedCallback']();
        this['classList'].add('table-tr');
    }

    updated(props) {
        if(props.has('filterableColumns')) {
            store.dispatch(changeFilterableColumns(this.filterableColumns))
        }
    }

    render() {
            return html `
            <style>${psuedoTable}</style>
            ${this.filterableColumnHeaders.map((key, i) => {
                if (key) {
                    const options = uniqueValuesInCol(this.data, key);
                    return html `
                        <span class="table-th">
                            <data-table-column-filter .options="${options}" key="${key}"></data-table-column-filter>
                        </span>`;
                }
                    return html `<span class="table-th"></span>`
            })}

            `
    }
}

defineComponent(ColumnFilter.componentName, ColumnFilter, 'data-table');
