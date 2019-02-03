import {LitElement, html, property} from "@polymer/lit-element";
import {filterData} from "../state/actions";
import {isSelectedFilter} from "../logic";
import {dispatch} from "../../../utils/extendableStore";

export default class ColumnFilter extends LitElement {
    public static componentName = 'column-filter';

    @property({type: Array})
    options: Array<any> = [];

    @property({type: String})
    key:string;

    @property({type: String})
    styleOverrides = '';

    protected activeFilters: Array<any> = [];

    createRenderRoot() {
        return this;
    }

    public render() {
        return html`
            <select class="form-control" @change="${(ev: any) => {this.filterCol(this.key, ev.path[0].value)}}">
                <option value="">--${this.key}--</option>
                ${this.options.map((opt) => {
                    return html`<option ?selected="${isSelectedFilter(this.activeFilters, opt)}" value="${opt}">${opt}</option>`
                })}
            </select>`
    }

    filterCol(key: string, queryVal: any) {
        if (!queryVal) {
            dispatch(filterData({key, queryVal}))
        } else {
            dispatch(filterData({key, queryVal}))
        }
    }
}

