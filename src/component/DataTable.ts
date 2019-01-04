import {LitElement, html, property} from "@polymer/lit-element";
import {parseTable} from "../utils/table";
import {
    Filter,
    FilterableOpts,
    AjaxOpts,
    PaginateOpts,
    ExportableOpts,
    SummableOpts,
    OrderableOpts, RenderableOpts, SortableOpts
} from "../declarations";
import {
    applyAllFilters, getPageSlice,
    getSortedFlags, getSummedCols, hasActiveFilter, isActiveFilter, resetFilters, searchData,
    toggleSortOnCol, uniqueValuesInCol, updateFilters
} from "./logic";
import {collectionToValues, isCollection} from "../utils/array";
import {isEqual} from "lodash";
import {exportCsv, makeExportableCsv} from "../utils/export";
import {clearInputsFromArray} from "../utils/dom";
import {datasetToProps, findInSlot, mergeDefaults} from "../utils/component";
import pureCss from "./pure-min.css"
import style from "./style.css"
import {htmlStringToElement} from "../utils/html";

export default class DataTable extends LitElement {

    public static componentName = 'data-table';

    public static renderRoot = 'shadow';

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

    public currentPage: number = 1;
    protected originalData: Array<any> = [];
    protected searchedData: Array<any> = [];
    protected sortedFlags: Array<number> = [];
    protected activeFilters: Array<Filter> = [];
    protected summedCols: Array<any> = [];

    createRenderRoot() {
        return DataTable.renderRoot === 'light-dom' ? this : this.attachShadow({mode: 'open'});
    }

    firstUpdated() {
        datasetToProps(this);
        mergeDefaults(this, ['orderable', 'summable', 'filterable', 'paginatable', 'renderable', 'sortable', 'exportables', 'ajax']);

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

    updateData(data: Array<any>) {
        this.headers = Object.keys(data[0]);

        this.sortedFlags = this.headers.map(() => {
            return -1;
        });

        this.activeFilters = this.headers.map((key) => {
            return {key, value: ''};
        });

        if (this.orderable.enabled) {
            data = this.sortData(this.orderable.column, this.orderable.order, data);
        }

        this.originalData = data.slice();

        this.refreshData(data);
    }


    refreshData(data: Array<any>, applyFilters = false, currentPage = 1) {
        if (data[0] && !isEqual(Object.keys(data[0]), this.headers)) {
            throw new Error('The headers of the given dataset do not match the existing ones. For new headers please use the init() method')
        }

        if (applyFilters) {
            data = applyAllFilters(data, this.activeFilters)
        }

        if (this.summable.enabled) {
            this.summedCols = getSummedCols(data, this.headers, this.summable.colIndexes, this.summable.formatter)
        }

        if (this.paginatable.enabled) {
            this.currentPage = currentPage;
            data = getPageSlice(data, currentPage, Number(this.paginatable.resultsPerPage))
        }

        this.data = data;
        this.rows = collectionToValues(this.data);
    }

    searchData(queryVal: string) {
        this.searchedData = searchData(this.originalData, queryVal);

        this.refreshData(this.searchedData, true);
    }

    sortCol(index: number, order = null) {
        let data;

        if (this.searchedData.length) {
            data = this.sortData(index, order, this.searchedData);
            this.searchedData = data.slice();
        } else {
            data = this.sortData(index, order, this.originalData);
            this.originalData = data.slice();
        }

        this.refreshData(data, true);
    }

    protected sortData(index: number, order = null, data?: Array<any>) {
        if (!data) data = this.data;
        const key = this.headers[index];
        this.sortedFlags = getSortedFlags(this.sortedFlags, index, order);

        return toggleSortOnCol(data, this.sortedFlags[index], key);
    }

    filterCol(key: string, queryValue: any) {
        this.refreshData(this.filterData(key, queryValue));
    }

    protected filterData(key: string, queryValue: any, data?: Array<any>) {
        this.activeFilters = updateFilters(this.activeFilters, key, queryValue);
        if (!data) {
            return this.getActiveData();
        } else {
            return applyAllFilters(data, this.activeFilters);
        }
    }

    getActiveData(): Array<any> {
        let data = this.searchedData.length ? this.searchedData : this.originalData;

        if (hasActiveFilter(this.activeFilters)) {
            data = applyAllFilters(data, this.activeFilters)
        }

        return data;
    }

    reset() {
        clearInputsFromArray(this, ['input', 'select'], ['#per-page']);
        this.activeFilters = resetFilters(this.activeFilters);
        this.searchedData = [];

        this.refreshData(this.originalData)
    }

    getTotalPages(): number {
        return Math.ceil(this.getActiveData().length / this.paginatable.resultsPerPage);
    }

    getTotalItems() {
        return this.getActiveData().length;
    }

    getTotalDataItems() {
        return this.data.length;
    }

    nextPage() {
        if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
        }

        this.changePage(this.currentPage);
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
        this.changePage(this.currentPage);
    }

    changePage(pageNum: number) {
        if (pageNum > this.getTotalPages()) {
            pageNum = this.getTotalPages()
        }
        if (pageNum < 1) {
            pageNum = 1;
        }
        this.currentPage = pageNum;

        this.refreshData(this.getActiveData(), null, this.currentPage)
    }

    protected gotoPage() {
        const pageInput: any = this.shadowRoot.querySelector('#go');
        this.changePage(Number(pageInput.value));
    }

    setResultsPerPage(perPage: number) {
        this.paginatable.resultsPerPage = perPage;
        this.refreshData(this.originalData, true)
    }

    export(exportable: ExportableOpts) {
        switch (exportable.type) {
            case 'csv':
                const rows = collectionToValues(this.getActiveData());
                rows.unshift(this.headers);

                if (this.summable.enabled) {
                    const sums = getSummedCols(this.getActiveData(), this.headers, this.summable.colIndexes);
                    rows.push(sums)
                }

                exportCsv(makeExportableCsv(rows), exportable.filename);
                break;
        }
    }

    render() {
        return html`
            <style>${this.theme + this.styleOverrides}</style>
            <slot style="display: none"></slot>
            <div class="container pure-form">
                <div class="top-controls">
                    <input id="search" placeholder="Search..." type="text" @keyup="${(ev: any) => {
            this.searchData(ev.path[0].value)
        }}">
                    <button class="pure-button control-item" type="button" @click="${() => {
            this.reset()
        }}">Reset</button>
                    <div class="per-page-selector control-item">
                        ${this.perPageSelectorTemplate()}
                    </div>
                    <div class="export-buttons control-item right">
                        ${this.exportButtonsTemplate()}
                    </div>
                </div>
                ${this.loading ? html`<div class="loader">Loading...</div>` : ''}
                ${this.tableTemplate()}
                <div class="bottom-controls">
                    ${this.paginationTemplate()}
                </div>
            </div>
        `
    }

    protected tableTemplate() {
        return html`
            <table class="pure-table pure-table-bordered">
                <thead>
                    <tr>
                        ${this.headers.map((header, i) => {
                            if(this.sortable.enabled && this.sortable.exceptCols.indexOf(i) !== -1) {
                                return html `<th>${header}</th>`
                            } else {
                                return html`<th @click="${() => { this.sortCol(i)}}">${header} ${this.sortArrow(i)}</th>`    
                            }
                        })}                        
                    </tr>
                    ${this.filterTemplate()}
                </thead>
                <tbody>
                    ${this.rows.map((row) => {
            return this.rowTemplate(row)
        })}                        
                </tbody>
                ${this.footerTemplate()}
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

    protected exportButtonsTemplate() {
        return html`
            ${this.exportables.map((exportItem) => {
            if (exportItem.enabled) {
                return html`<button class="pure-button" @click="${() => {
                    this.export(exportItem)
                }}" type="button">${exportItem.type}</button>`
            }
        })}
        `
    }

    protected perPageSelectorTemplate() {
        if (this.paginatable.enabled) {
            return html`
                <select id="per-page" @change="${(ev) => {
                this.setResultsPerPage(ev.path[0].value)
            }}">
                    ${this.paginatable.perPageOptions.map((option) => {
                return html`<option ?selected="${option === this.paginatable.resultsPerPage}" value="${option}">${option}</option>`
            })}
                </select><span> results per page</span>`
        }
    }

    protected rowTemplate(row) {
        return html`
            <tr>
                ${row.map((cell,i) => {
                    if(this.renderable.enabled && this.renderable.colIndexes.indexOf(i) !== -1) {
                        return html`<td>${htmlStringToElement(cell)}</td>`            
                    } else {
                        return html`<td>${cell}</td>`
                    }
                })}
            </tr>
        `
    }

    protected filterTemplate() {
        if (this.filterable.enabled && this.filterable.colIndexes.length) {
            return html`
                <tr>
                   ${this.headers.map((key, i) => {
                if (this.filterable.colIndexes.indexOf(i) !== -1) {
                    return this.filterSelectTemplate(key);
                }
                return html`<td></td>`
            })}     
                </tr>`
        }
    }

    protected filterSelectTemplate(key) {
        const options = uniqueValuesInCol(this.originalData, key);

        return html`
            <td>
                <select @change="${(ev: any) => {
            this.filterCol(key, ev.path[0].value)
        }}">
                    <option value="">--${key}--</option>
                    ${options.map((opt) => {
            return html`<option ?selected="${isActiveFilter(this.activeFilters, opt)}" value="${opt}">${opt}</option>`
        })}
                </select>
            </td>`
    }

    protected footerTemplate() {
        if (this.summable.enabled) {
            return html`
                <tfoot>
                    ${this.summedCols.map((sum) => {
                return html`<td>${sum}</td>`
            })}
                </tfoot>
            `
        }
    }

    protected paginationTemplate() {
        if (this.paginatable.enabled) {
            return html`
                <button class="pure-button control-item" ?disabled="${this.currentPage <= 1}" @click="${() => {
                this.changePage(1)
            }}" type="button">First</button>
                <button class="pure-button control-item" ?disabled="${this.currentPage <= 1}" @click="${() => {
                this.prevPage()
            }}" type="button">&lt;&lt;Prev</button>
                <button class="pure-button control-item" ?disabled="${this.currentPage >= this.getTotalPages()}" @click="${() => {
                this.nextPage()
            }}" type="button">Next&gt;&gt;</button>
                <button class="pure-button control-item" ?disabled="${this.currentPage >= this.getTotalPages()}" @click="${() => {
                this.changePage(this.getTotalPages())
            }}" type="button">Last</button>
                <span class="control-item">Page ${this.currentPage} of ${this.getTotalPages()}</span>
                <input id="go" class="control-item" type="number" min="1" max="${this.getTotalPages()}" value="${this.currentPage}">
                <button class="pure-button control-item" @click="${() => {
                this.gotoPage()
            }}" type="button">Go</button>
                <span class="showing control-item right">Showing ${this.getTotalDataItems()} of ${this.getTotalItems()}</span> 
            `
        }
    }

}
