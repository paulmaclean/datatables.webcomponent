import {LitElement, html, property} from "@polymer/lit-element";
import psuedoTable from "../../../shared/psuedo-table.css"
import {connect} from "pwa-helpers/connect-mixin";
import {store} from "../../../state/store";
import {getData, getHeaders, getOriginalData} from "../../../state/reducers/dataReducer";
import {defineComponent} from "../../..";
import {changeFilterableColumns} from "../state/actions";
import {getFilters} from "../state/filtersReducer";
import {uniqueValuesInCol} from "../../../state/logic/datatable";
import ColumnFilter from "./ColumnFilter";


export default class ColumnFilters extends connect(store.instance())(LitElement) {
    public static componentName = 'column-filters';

    @property({type: Array})
    filters: Array<any>;

    @property({type: Array})
    data: Array<any>;

    @property({type: Array})
    colsToFilter: Array<any>;

    stateChanged(state) {
        this.data = getOriginalData(state);
        this.filters = getFilters(state);
    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super['connectedCallback']();
        this['classList'].add('table-tr');
    }

    updated(props) {
        if(props.has('colsToFilter')) {
            store.dispatch(changeFilterableColumns(this.colsToFilter))
        }
    }

    render() {
            return html `
            <style>${psuedoTable}</style>
            ${this.filters.map((key, i) => {
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
