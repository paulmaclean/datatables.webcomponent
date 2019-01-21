import {LitElement, html, property} from "@polymer/lit-element";
import {store} from "../../../state/store";
import {fetchData, receiveData} from "../../../state/actions";
import {findInSlot} from "../../../utils/component";
import {parseTable} from "../../../utils/table";

export default class DataTable extends LitElement {

    public static componentName = "data-table";

    @property({type: Object})
    data: Array<any> = [];

    ajaxDefaults = {
        url: ''
    };

    @property({type: Object})
    ajax = this.ajaxDefaults;

    public firstUpdated() {
         this.init();
    }

    init(data?: Array<any>) {

        //Passed in data via direct method call
        if (data && data.length) {
            store.dispatch(receiveData(data));
            return
        }

        //Data sent in via a property
        if (this.data.length) {
            store.dispatch(receiveData(this.data));
            return
        }

        //Data fetched from url via a property
        if (this.ajax.url) {
            store.dispatch(fetchData(this.ajax.url));
            return
        }

        //Slotted table data
        const table = findInSlot(this, 'table');
        if (table) {
            store.dispatch(receiveData(parseTable(table)));
        }
    }

    render() {
        return html `
            <slot name="init-table" hidden></slot>
            <slot name="top"></slot>
            <slot name="middle"></slot>
            <slot name="bottom"></slot>
        `
    }
}

// import {LitElement, html, property} from "@polymer/lit-element";
// import {parseTable} from "../../utils/table";
// import {
//     Filter,
//     FilterableOpts,
//     AjaxOpts,
//     PaginateOpts,
//     ExportableOpts,
//     SummableOpts,
//     OrderableOpts, RenderableOpts, SortableOpts
// } from "../../declarations";
// import {
//     applyAllFilters, getPageSlice,
//     getSortedFlags, getSummedCols, hasActiveFilter, isActiveFilter, resetFilters, searchData,
//     toggleSortOnCol, uniqueValuesInCol, updateFilters
// } from "./logic";
// import {collectionToValues, isCollection} from "../../utils/array";
// import {isEqual} from "lodash";
// import {exportCsv, makeExportableCsv} from "../../utils/export";
// import {clearInputsFromArray} from "../../utils/dom";
// import {datasetToProps, findInSlot, mergeDefaults} from "../../utils/component";
// import pureCss from "../../shared/pure-min.css"
// import style from "./style.css"
// import {htmlStringToElement} from "../../utils/html";
// import Pagination from "../pagination/Pagination";
// import Search from "../search/Search";
// import PerPageSelector from "../per-page-selector/PerPageSelector";
// import Table from "../table/Table";
// import ColumnFilter from "../column-filter/ColumnFilter";
//
// export default class DataTable extends LitElement {
//
//     public static componentName = 'data-table';
//
//     public static renderRoot = 'shadow';
//
//     public static events = {
//         'NEXT_PAGE': 'next-page'
//     };
//
//     @property({type: String})
//     theme = pureCss + style;
//
//     @property({type: String})
//     styleOverrides = '';
//
//     @property({type: Object})
//     data: Array<any> = [];
//
//     @property({type: Array})
//     headers: Array<string> = [];
//
//     @property({type: Array})
//     rows: Array<any> = [];
//
//     protected orderableDefaults: OrderableOpts = {
//         enabled: true,
//         column: 0,
//         order: 'asc',
//     };
//
//     @property({type: Object})
//     orderable: OrderableOpts = this.orderableDefaults;
//
//     protected summableDefaults: SummableOpts = {
//         enabled: true,
//         colIndexes: [],
//         formatter: (val, index) => {
//             return new Intl.NumberFormat('en-UD').format(val)
//         }
//     };
//
//     @property({type: Object})
//     summable: SummableOpts = this.summableDefaults;
//
//     filterableDefaults: FilterableOpts = {
//         enabled: true,
//         colIndexes: []
//     };
//
//     @property({type: Object})
//     filterable: FilterableOpts = this.filterableDefaults;
//
//     paginatableDefaults: PaginateOpts = {
//         enabled: true,
//         resultsPerPage: 10,
//         perPageOptions: [5, 10, 20, 50, 100]
//     };
//
//     @property({type: Object})
//     paginatable: PaginateOpts = this.paginatableDefaults;
//
//     renderableDefaults: RenderableOpts = {
//         enabled: true,
//         colIndexes: []
//     };
//
//     @property({type: Object})
//     renderable: RenderableOpts = this.renderableDefaults;
//
//     sortableDefaults: SortableOpts = {
//         enabled: true,
//         exceptCols: []
//     };
//
//     @property({type: Object})
//     sortable: SortableOpts = this.sortableDefaults;
//
//
//     exportablesDefaults: Array<ExportableOpts> = [
//         {'type': 'csv', 'enabled': true, filename: 'export.csv'}
//     ];
//
//     @property({type: Object})
//     exportables: Array<ExportableOpts> = this.exportablesDefaults;
//
//     ajaxDefaults: AjaxOpts = {
//         url: ''
//     };
//
//     @property({type: Object})
//     ajax: AjaxOpts = this.ajaxDefaults;
//
//     @property({type: Boolean})
//     loading = false;
//
//     @property({type: Array})
//     activeData = [];
//
//     protected originalData: Array<any> = [];
//     protected searchedData: Array<any> = [];
//
//     @property({type: Number})
//     protected currentPage: number = 1;
//
//     createRenderRoot() {
//         return DataTable.renderRoot === 'light-dom' ? this : this.attachShadow({mode: 'open'});
//     }
//
//     connectedCallback() {
//         super.connectedCallback();
//         datasetToProps(this);
//         mergeDefaults(this, ['orderable', 'summable', 'filterable', 'paginatable', 'renderable', 'sortable', 'exportables', 'ajax']);
//     }
//
//     firstUpdated() {
//         this.init()
//     }
//
//     init(data?: Array<any>) {
//
//         // if (data && data.length) {
//         //     this.data = data;
//         // }
//         //
//         // if (this.data.length) {
//         //     this.updateData(this.data);
//         //     return
//         // }
//         //
//         // if (this.ajax.url) {
//         //     this.loading = true;
//         //     fetch(this.ajax.url)
//         //         .then((response) => {
//         //             return response.json()
//         //         })
//         //         .then((data) => {
//         //             if (!isCollection(data)) {
//         //                 throw new Error('The dataset is not a uniform array of objects. You may need to pre-process the returned data and use the data property')
//         //             }
//         //             this.loading = false;
//         //             this.updateData(data)
//         //         }).catch((err) => {
//         //         this.loading = false;
//         //     });
//         //     return
//         // }
//         //
//         // const table = findInSlot(this, 'table');
//         // if (table) {
//         //     const data = parseTable(table);
//         //     this.updateData(data)
//         // }
//     }
//
//     refreshData(data: Array<any>) {
//
//     }
//
//     updateData(data: Array<any>) {
//         this.originalData = data.slice();
//         this.activeData = data;
//         //this.refreshData(data);
//     }
//
//     getActiveData() {
//         return this.activeData;
//     }
//
//     getTotalPages(): number {
//         return Math.ceil(this.getActiveData().length / this.paginatable.resultsPerPage);
//     }
//
//     getTotalItems() {
//         return this.getActiveData().length;
//     }
//
//     getTotalActiveItems() {
//         return this.data.length;
//     }
//
//     protected emit(name: string, payload) {
//         this.dispatchEvent(new CustomEvent(name, {detail: payload}),)
//     }
//
//     public getExportableData() {
//         const rows = collectionToValues(this.getActiveData());
//         rows.unshift(this.headers);
//
//         if (this.summable.enabled) {
//             const sums = getSummedCols(this.getActiveData(), this.headers, this.summable.colIndexes);
//             rows.push(sums)
//         }
//
//         return rows;
//     }
//
//     render() {
//         return html`
//             <style>${this.theme + this.styleOverrides}</style>
//             <slot style="display: none"></slot>
//
//             <div class="container pure-form">
//                 <div class="top-controls">
//                     <data-table-search class="control-item"
//                         .data=${this.originalData}
//                     >
//                     </data-table-search>
//
//                     <data-table-per-page-selector class="per-page-selector control-item"
//                         .options=${this.paginatable.perPageOptions}
//                         .activeOption=${this.paginatable.resultsPerPage}
//                         >
//                     </data-table-per-page-selector>
//
//                     <data-table-export-buttons class="export-buttons control-item right"
//                         .exportables="${this.exportables}"
//                         .data="${this.getExportableData()}"
//                     >
//                     </data-table-export-buttons>
//                 </div>
//
//                 <data-table-table
//                     .data="${this.activeData}"
//                     .paginatable="${this.paginatable}"
//                     .filterable="${this.filterable}"
//                     currentPage="${this.currentPage}"
//                 >
//                 </data-table-table>
//
//                 <div class="bottom-controls">
//                     <data-table-pagination
//                         styleOverrides="${this.styleOverrides}"
//                         currentPage="${this.currentPage}"
//                         totalPages="${this.getTotalPages()}"
//                         totalItems="${this.getTotalItems()}"
//                     ></data-table-pagination>
//                 </div>
//             </div>
//         `
//     }
// }
//
//
// ///<button class="pure-button control-item" type="button" @click="${() => {
// //             this.reset()
// //         }}">Reset</button>