import {LitElement, html, property} from "@polymer/lit-element";
import psuedoTable from "../../../shared/psuedo-table.css"
import {connect} from "pwa-helpers/connect-mixin";
import {store} from "../../../state/store";
import {findInNamedSlot, findInNamedSlotDeep, getSlotElementsByName} from "../../../utils/component";
import {getHeaders, getRows} from "../../../state/reducers/dataReducer";
import {getExtendable} from "../../../utils/extendSelectors";


export default class Table extends connect(store.instance())(LitElement) {

    public static componentName = 'table';

    // public static events = {
    //     'SORT_COL': 'sort-col'
    // };
    //
    // paginatableDefaults: PaginateOpts = {
    //     enabled: true,
    //     resultsPerPage: 10,
    //     perPageOptions: [5, 10, 20, 50, 100]
    // };
    //
    // @property({type: Object})
    // paginatable: PaginateOpts = this.paginatableDefaults;
    //
    // filterableDefaults: FilterableOpts = {
    //     enabled: true,
    //     colIndexes: []
    // };
    //
    // @property({type: Object})
    // filterable: FilterableOpts = this.filterableDefaults;
    //

    @property({type: Array})
    sortableExceptions = [];

    @property({type: Array})
    public headers: Array<string> = [];

    @property({type: Array})
    protected rows: Array<any> = [];

    @property({type: Array})
    protected tableHeaders = [];

    stateChanged(state) {
        this.headers = getHeaders(state);
        this.rows = getExtendable(getRows, 'rows')(state);
    }

    render() {
        return html`
            <style>${psuedoTable}</style>
            <div class="table">
                <header class="table-thead">
                    <slot name="table-headers">
                        ${this.headers.map((header, i) => {
                            return html`<span class="table-th">${header}</span>`
                        })}
                    </slot>
                    <slot name="extra-table-headers"></slot>
                </header>
                <section class="table-tbody">
                    ${this.rows.map((row) => {
                        return this.rowTemplate(row)
                    })}
                </section>
            </div>
            `
    }

    // protected sortHeaders() {
    //     return html`
    //     ${this.headers.map((header, i) => {
    //         if (this.sortableExceptions.indexOf(i) !== -1) {
    //             return html `
    //                 <th>${header}</th>`
    //         } else {
    //             return html `
    //                 <th>
    //                     <data-table-sort key="${header}"></data-table-sort>
    //                 </th>`
    //         }
    //     })}
    //     `
    // }
    //
    // protected filterHeaders() {
    //     return html `
    //     ${this.headers.map((key, i) => {
    //         if (this.filterable.colIndexes.indexOf(i) !== -1) {
    //             return html `
    //                 <td>
    //                     <data-table-column-filter key="${key}"></data-table-column-filter>
    //                 </td>`;
    //         }
    //             return html `<td></td>`
    //     })}
    //
    //     `
    // }
    //
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