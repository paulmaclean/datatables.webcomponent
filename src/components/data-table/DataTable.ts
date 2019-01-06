import {LitElement, html, property} from "@polymer/lit-element";
import {parseTable} from "../../utils/table";
import {
    Filter,
    FilterableOpts,
    AjaxOpts,
    PaginateOpts,
    ExportableOpts,
    SummableOpts,
    OrderableOpts, RenderableOpts, SortableOpts
} from "../../declarations";
import {
    applyAllFilters, getPageSlice,
    getSortedFlags, getSummedCols, hasActiveFilter, isActiveFilter, resetFilters, searchData,
    toggleSortOnCol, uniqueValuesInCol, updateFilters
} from "./logic";
import {collectionToValues, isCollection} from "../../utils/array";
import {isEqual} from "lodash";
import {exportCsv, makeExportableCsv} from "../../utils/export";
import {clearInputsFromArray} from "../../utils/dom";
import {datasetToProps, findInSlot, mergeDefaults} from "../../utils/component";
import pureCss from "../../shared/pure-min.css"
import style from "./style.css"
import {htmlStringToElement} from "../../utils/html";
import Pagination from "../pagination/Pagination";
import Search from "../search/Search";
import PerPageSelector from "../per-page-selector/PerPageSelector";
import Table from "../table/Table";

export default class DataTable extends LitElement {

    public static componentName = 'data-table';

    public static renderRoot = 'shadow';

    public static events = {
        'NEXT_PAGE': 'next-page'
    };

    @property({type: String})
    theme = pureCss + style;

    @property({type: String})
    styleOverrides = '';

    @property({type: Object})
    data: Array<any> = [];

    @property({type: Array})
    headers: Array<string> = [];

    @property({type: Array})
    rows: Array<any> = [];

    protected orderableDefaults: OrderableOpts = {
        enabled: true,
        column: 0,
        order: 'asc',
    };

    @property({type: Object})
    orderable: OrderableOpts = this.orderableDefaults;

    protected summableDefaults: SummableOpts = {
        enabled: true,
        colIndexes: [],
        formatter: (val, index) => {
            return new Intl.NumberFormat('en-UD').format(val)
        }
    };

    @property({type: Object})
    summable: SummableOpts = this.summableDefaults;

    filterableDefaults: FilterableOpts = {
        enabled: true,
        colIndexes: []
    };

    @property({type: Object})
    filterable: FilterableOpts = this.filterableDefaults;

    paginatableDefaults: PaginateOpts = {
        enabled: true,
        resultsPerPage: 10,
        perPageOptions: [5, 10, 20, 50, 100]
    };

    @property({type: Object})
    paginatable: PaginateOpts = this.paginatableDefaults;

    renderableDefaults: RenderableOpts = {
        enabled: true,
        colIndexes: []
    };

    @property({type: Object})
    renderable: RenderableOpts = this.renderableDefaults;

    sortableDefaults: SortableOpts = {
        enabled: true,
        exceptCols: []
    };

    @property({type: Object})
    sortable: SortableOpts = this.sortableDefaults;


    exportablesDefaults: Array<ExportableOpts> = [
        {'type': 'csv', 'enabled': true, filename: 'export.csv'}
    ];

    @property({type: Object})
    exportables: Array<ExportableOpts> = this.exportablesDefaults;

    ajaxDefaults: AjaxOpts = {
        url: ''
    };

    @property({type: Object})
    ajax: AjaxOpts = this.ajaxDefaults;

    @property({type: Boolean})
    loading = false;

    @property({type: Array})
    activeData = [];

    protected originalData: Array<any> = [];
    protected searchedData: Array<any> = [];
    protected currentPage: number = 1;

    createRenderRoot() {
        return DataTable.renderRoot === 'light-dom' ? this : this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        super.connectedCallback();
        datasetToProps(this);
        mergeDefaults(this, ['orderable', 'summable', 'filterable', 'paginatable', 'renderable', 'sortable', 'exportables', 'ajax']);
    }

    firstUpdated() {
        const search = this.shadowRoot.querySelector('data-table-search') as HTMLElement;
        search.addEventListener(Search.events.SEARCH_DATA, (ev: any) => {
            if (ev.detail.queryVal) {
                this.activeData = ev.detail.results;
            } else {
                this.activeData = this.originalData;
            }
        });

        const pagination = this.shadowRoot.querySelector('data-table-pagination') as HTMLElement;
        pagination.addEventListener(Pagination.events.CHANGE_PAGE, (ev: any) => {
            this.currentPage = ev.detail.currentPage;
            //this.refreshData(this.getActiveData(), null, this.currentPage)
        });

        const perPageSelector = this.shadowRoot.querySelector('data-table-per-page-selector') as HTMLElement;
        perPageSelector.addEventListener(PerPageSelector.events.SET_RESULTS_PER_PAGE, (ev: any) => {
            this.paginatable.resultsPerPage = ev.detail.resultsPerPage;
            //this.refreshData(this.originalData, true)
        });

        const table = this.shadowRoot.querySelector('data-table-table') as HTMLElement;

        table.addEventListener(Table.events.SORT_COL, (ev: any) => {
            // const data = ev.data;
            // if (this.searchedData.length) {
            //     this.searchedData = data.slice();
            // } else {
            //     this.originalData = data.slice();
            // }
            // this.refreshData(data, true);
        });


        this.init()
    }

    init(data?: Array<any>) {

        if (data && data.length) {
            this.data = data;
        }

        if (this.data.length) {
            this.updateData(this.data);
            return
        }

        if (this.ajax.url) {
            this.loading = true;
            fetch(this.ajax.url)
                .then((response) => {
                    return response.json()
                })
                .then((data) => {
                    if (!isCollection(data)) {
                        throw new Error('The dataset is not a uniform array of objects. You may need to pre-process the returned data and use the data property')
                    }
                    this.loading = false;
                    this.updateData(data)
                }).catch((err) => {
                this.loading = false;
            });
            return
        }

        const table = findInSlot(this, 'table');
        if (table) {
            const data = parseTable(table);
            this.updateData(data)
        }
    }

    refreshData(data: Array<any>) {

    }

    updateData(data: Array<any>) {
        this.originalData = data.slice();
        this.activeData = data;
        //this.refreshData(data);
    }

    // refreshData(data: Array<any>, applyFilters = false, currentPage = 1) {
    //     if (data[0] && !isEqual(Object.keys(data[0]), this.headers)) {
    //         throw new Error('The headers of the given dataset do not match the existing ones. For new headers please use the init() method')
    //     }
    //
    //     if (applyFilters) {
    //         data = applyAllFilters(data, this.activeFilters)
    //     }
    //
    //     if (this.summable.enabled) {
    //         this.summedCols = getSummedCols(data, this.headers, this.summable.colIndexes, this.summable.formatter)
    //     }
    //
    //     if (this.paginatable.enabled) {
    //         this.currentPage = currentPage;
    //         data = getPageSlice(data, currentPage, Number(this.paginatable.resultsPerPage))
    //     }
    //
    //     this.data = data;
    //     this.rows = collectionToValues(this.data);
    // }

    getActiveData(): Array<any> {
        return this.searchedData.length ? this.searchedData : this.originalData;
    }

    // getActiveData(): Array<any> {
    //     let data = this.getData();
    //
    //     if (hasActiveFilter(this.activeFilters)) {
    //         data = applyAllFilters(data, this.activeFilters)
    //     }
    //
    //     return data;
    // }

    // reset() {
    //     clearInputsFromArray(this, ['input', 'select'], ['#per-page']);
    //     this.activeFilters = resetFilters(this.activeFilters);
    //     this.searchedData = [];
    //
    //     this.refreshData(this.originalData)
    // }

    getTotalPages(): number {
        return Math.ceil(this.getActiveData().length / this.paginatable.resultsPerPage);
    }

    getTotalItems() {
        return this.getActiveData().length;
    }

    getTotalActiveItems() {
        return this.data.length;
    }

    protected emit(name: string, payload) {
        this.dispatchEvent(new CustomEvent(name, {detail: payload}),)
    }

    public getExportableData() {
        const rows = collectionToValues(this.getActiveData());
        rows.unshift(this.headers);

        if (this.summable.enabled) {
            const sums = getSummedCols(this.getActiveData(), this.headers, this.summable.colIndexes);
            rows.push(sums)
        }

        return rows;
    }

    render() {
        return html`
            <style>${this.theme + this.styleOverrides}</style>
            <slot style="display: none"></slot>
            
            <div class="container pure-form">
                <div class="top-controls">
                    <data-table-search class="control-item"
                        .data=${this.originalData}
                    >
                    </data-table-search>
                
                    <data-table-per-page-selector class="per-page-selector control-item"
                        .options=${this.paginatable.perPageOptions}
                        .activeOption=${this.paginatable.resultsPerPage}
                        >
                    </data-table-per-page-selector>
                    
                    <data-table-export-buttons class="export-buttons control-item right"
                        .exportables="${this.exportables}"
                        .data="${this.getExportableData()}"
                    >
                    </data-table-export-buttons>
                </div>
                
                <data-table-table
                    .data="${this.activeData}"
                >
                </data-table-table>
                
                <div class="bottom-controls">
                    <data-table-pagination
                        styleOverrides="${this.styleOverrides}"
                        currentPage="${this.currentPage}"
                        totalPages="${this.getTotalPages()}"
                        totalItems="${this.getTotalItems()}"
                        totalActiveItems="${this.getTotalActiveItems()}"
                    ></data-table-pagination>
                </div>
            </div>
        `
    }
}


///<button class="pure-button control-item" type="button" @click="${() => {
//             this.reset()
//         }}">Reset</button>