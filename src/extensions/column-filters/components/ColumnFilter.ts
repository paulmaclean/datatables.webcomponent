import {LitElement, html, property} from "@polymer/lit-element";
import {isSelectedFilter} from "../../../state/logic/datatable";
import {store} from "../../../state/store";
import {filterData} from "../state/actions";
// import {filterOnCol, isActiveFilter, searchData, uniqueValuesInCol, updateFilters} from "../data-table/logic";
// import {Filter} from "../../declarations";

export default class ColumnFilter extends LitElement {
    public static componentName = 'column-filter';
    // public static events = {
    //     'FILTER_COL': 'filter-col'
    // };

    @property({type: Array})
    options: Array<any> = [];

    @property({type: String})
    key:string;

    // @property({type: String})
    // theme = pureCss;

    @property({type: String})
    styleOverrides = '';

    protected activeFilters: Array<any> = [];

    public render() {
        //const options = uniqueValuesInCol(this.data, this.key);

        return html`
            <select @change="${(ev: any) => {this.filterCol(this.key, ev.path[0].value)}}">
                <option value="">--${this.key}--</option>
                ${this.options.map((opt) => {
                    return html`<option ?selected="${isSelectedFilter(this.activeFilters, opt)}" value="${opt}">${opt}</option>`
                })}
            </select>`
    }

    filterCol(key: string, queryVal: any) {
        if(!queryVal) {
            store.dispatch(filterData({key, queryVal}))
        }else{
            store.dispatch(filterData({key, queryVal}))
        }

    }

}

