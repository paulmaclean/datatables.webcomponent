import {LitElement, html, property} from "@polymer/lit-element";
import {connect} from "pwa-helpers/connect-mixin";
import {changeFilterableColumns} from "../state/actions";
import {getFilterableColumnHeaders} from "../state/reducer";
import ColumnFilter from "./ColumnFilter";
import {dispatch, getStore} from "../../../utils/extendableStore";
import {getData} from "../../../modules/data-table/src/state/reducer";
import {uniqueValuesInCol} from "../logic";
import {defineComponent} from "../../../utils/component";


export default class ColumnFilters extends connect(getStore())(LitElement) {
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
        this['classList'].add('tr');
    }

    updated(props) {
        if(props.has('filterableColumns')) {
            dispatch(changeFilterableColumns(this.filterableColumns))
        }
    }

    render() {
            return html `
            <style>.tr {display: table-row;}</style>
            ${this.filterableColumnHeaders.map((key, i) => {
                if (key) {
                    const options = uniqueValuesInCol(this.data, key);
                    return html `
                        <th class="form">
                            <data-table-column-filter .options="${options}" key="${key}"></data-table-column-filter>
                        </th>`;
                }
                    return html `<th></th>`
            })}

            `
    }
}

defineComponent(ColumnFilter.componentName, ColumnFilter, 'data-table');
