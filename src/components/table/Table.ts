import {LitElement, html, property} from "@polymer/lit-element";
import pureCss from "../../shared/pure-min.css"
import {htmlStringToElement} from "../../utils/html";
import {
    applyAllFilters,
    getSortedFlags,
    isActiveFilter,
    toggleSortOnCol,
    uniqueValuesInCol,
    updateFilters
} from "../data-table/logic";
import {Filter} from "../../declarations";
import {collectionToValues} from "../../utils/array";

export default class Table extends LitElement {

    public static componentName = 'table';

    public static events = {
        'SORT_COL': 'sort-col'
    }

    @property({type: String})
    theme = pureCss;

    @property({type: String})
    styleOverrides = '';

    @property({type: Array})
    public headers: Array<string> =[];

    @property({type: Array})
    public sortableExceptions: Array<number> = [];

    @property({type: Array})
    public data: Array<any> = [];

    protected sortedFlags: Array<number> = [];
    protected activeFilters: Array<Filter> = [];
    protected summedCols: Array<any> = [];
    protected rows: Array<any> = [];

    sortCol(index: number, order = null) {
        let data;
        data = this.sortData(index, order, this.data);

        this.emit(Table.events.SORT_COL, {index, order, data})
    }

    protected emit(name: string, payload) {
        this.dispatchEvent(new CustomEvent(name, {detail: payload}))
    }

    protected sortData(index: number, order = null, data?: Array<any>) {
        if (!data) data = this.data;
        const key = this.headers[index];
        this.sortedFlags = getSortedFlags(this.sortedFlags, index, order);

        return toggleSortOnCol(data, this.sortedFlags[index], key);
    }

    public updated(props) {
        if (props.get('data')) {
            this.headers = Object.keys(this.data[0]);

            this.sortedFlags = this.headers.map(() => {
                return -1;
            });

            this.activeFilters = this.headers.map((key) => {
                return {key, value: ''};
            });

            this.rows = collectionToValues(this.data);
        }
    }

    // filterCol(key: string, queryValue: any) {
    //     this.refreshData(this.filterData(key, queryValue));
    // }

    // protected filterData(key: string, queryValue: any, data?: Array<any>) {
    //     this.activeFilters = updateFilters(this.activeFilters, key, queryValue);
    //     if (!data) {
    //         return this.getActiveData();
    //     } else {
    //         return applyAllFilters(data, this.activeFilters);
    //     }
    //${this.loading ? html` <div class="loader">Loading...</div>` : ''}
    // }

    render() {
        return html`
        <style>${this.theme + this.styleOverrides}</style>
        
                <table class="pure-table pure-table-bordered">
                    <thead>
                        <tr>
                            ${this.headers.map((header, i) => {
            if (this.sortableExceptions.indexOf(i) !== -1) {
                return html`<th>${header}</th>`
            } else {
                return html`<th @click="${() => {
                    this.sortCol(i)
                }}">${header} ${this.sortArrow(i)}</th>`
            }
        })}                        
                        </tr>
                </thead>
                <tbody>
                    ${this.rows.map((row) => {
            return this.rowTemplate(row)
        })}                        
                </tbody>
            </table>        
            `
    }


    protected sortArrow(i) {
        switch (this.sortedFlags[i]) {
            case 0:
                return html`<span class="arrow active">&uarr;</span>`;
            case 1:
                return html`<span class="arrow active">&darr;</span>`;
            default:
                return html`<span class="arrow">&uarr;</span>`
        }

    }

    protected rowTemplate(row) {
        return html`
            <tr>
                ${row.map((cell, i) => {
            //if (this.renderable.enabled && this.renderable.colIndexes.indexOf(i) !== -1) {
            //return html`<td>${htmlStringToElement(cell)}</td>`
            //} else {
            return html`<td>${cell}</td>`
            //}
        })}
            </tr>
        `
    }

    // protected filterTemplate() {
    //     if (this.filterable.enabled && this.filterable.colIndexes.length) {
    //         return html`
    //             <tr>
    //                ${this.headers.map((key, i) => {
    //             if (this.filterable.colIndexes.indexOf(i) !== -1) {
    //                 return this.filterSelectTemplate(key);
    //             }
    //             return html`<td></td>`
    //         })}
    //             </tr>`
    //     }
    // }

    // protected filterSelectTemplate(key) {
    //     const options = uniqueValuesInCol(this.originalData, key);
    //
    //     return html`
    //         <td>
    //             <select @change="${(ev: any) => {
    //         this.filterCol(key, ev.path[0].value)
    //     }}">
    //                 <option value="">--${key}--</option>
    //                 ${options.map((opt) => {
    //         return html`<option ?selected="${isActiveFilter(this.activeFilters, opt)}" value="${opt}">${opt}</option>`
    //     })}
    //             </select>
    //         </td>`
    // }

    // protected footerTemplate() {
    //     if (this.summable.enabled) {
    //         return html`
    //             <tfoot>
    //                 ${this.summedCols.map((sum) => {
    //             return html`<td>${sum}</td>`
    //         })}
    //             </tfoot>
    //         `
    //     }
    // }


}