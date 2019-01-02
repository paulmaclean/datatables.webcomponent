import {LitElement, html, property} from "@polymer/lit-element";
import {parseTable} from "../utils/table";
import {Filter, FilterableOpts, AjaxOpts, PaginateOpts, ExportableOpts, SummableOpts} from "../declarations";
import {
    applyAllFilters, filterOnCol, getPageSlice,
    getSortedFlags, getSummedCols, hasActiveFilter, resetFilters, searchData,
    toggleSortOnCol, uniqueValuesInCol, updateFilters
} from "./logic";
import {collectionToValues, isCollection} from "../utils/array";
import {isEqual} from "lodash";
import {exportCsv, makeExportableCsv} from "../utils/export";

import {clearInputsFromArray} from "../utils/dom";
import {datasetToProps, findInSlot, mergeDefaults} from "../utils/component";

export default class DataTable extends LitElement {

    public static componentName = 'data-table';

    @property({type: Object})
    data: Array<any> = [];

    @property({type: Array})
    headers: Array<string> = [];

    @property({type: Array})
    rows: Array<any> = [];

    protected summableDefaults: SummableOpts = {
        enabled: true,
        colIndexes: [],
        formatter: (val, index) => {
            return new Intl.NumberFormat('en-UD').format(val)
        }
    };

    @property({type: Object})
    summable: SummableOpts = this.summableDefaults;

    filterableDefaults : FilterableOpts = {
        enabled: true,
        colIndexes: []
    };

    @property({type: Object})
    filterable: FilterableOpts = this.filterableDefaults;

    paginatableDefaults : PaginateOpts = {
        enabled: true,
        resultsPerPage: 10,
        perPageOptions: [5, 10, 20, 50, 100]
    };

    @property({type: Object})
    paginatable: PaginateOpts = this.paginatableDefaults;

    exportablesDefaults: Array<ExportableOpts> = [
        {'type': 'csv', 'enabled': true, filename: 'export.csv'}
    ];

    @property({type: Object})
    exportables: Array<ExportableOpts> = this.exportablesDefaults;

    ajaxDefaults : AjaxOpts = {
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


    firstUpdated() {
        datasetToProps(this);
        mergeDefaults(this, ['summable', 'filterable', 'paginatable', 'exportables', 'ajax']);

        this.init()
    }

    init(data?: Array<any>) {

        if(data && data.length) {
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

        this.originalData = data.slice();
        this.headers = Object.keys(data[0]);

        this.sortedFlags = this.headers.map(() => {
            return -1;
        });

        this.activeFilters = this.headers.map((key) => {
            return {key, value: ''};
        });

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
        const key = this.headers[index];
        this.sortedFlags = getSortedFlags(this.sortedFlags, index, order);
        const data = toggleSortOnCol(this.data, this.sortedFlags[index], key);

        this.refreshData(data);
    }

    filterCol(key: string, queryValue: any) {
        const data = filterOnCol(this.getActiveData(), key, queryValue);
        this.activeFilters = updateFilters(this.activeFilters, key, queryValue);

        this.refreshData(data);
    }

    getExportableData() {
        return this.getPaginatableData();
    }

    getActiveData() {
        return this.searchedData.length ? this.searchedData : this.originalData;
    }

    protected getPaginatableData() {
        if (hasActiveFilter(this.activeFilters)) {
            return this.data;
        }
        return this.searchedData.length ? this.searchedData : this.originalData;
    }

    reset() {
        clearInputsFromArray(this, ['input', 'select'], ['#per-page']);
        this.activeFilters = resetFilters(this.activeFilters);
        this.searchedData = [];

        this.refreshData(this.originalData)
    }

    getTotalPages(): number {
        return Math.ceil(this.getPaginatableData().length / this.paginatable.resultsPerPage);
    }

    getTotalItems() {
        return this.getPaginatableData().length;
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

        this.refreshData(this.getPaginatableData(), null, this.currentPage)
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
                const rows = collectionToValues(this.getExportableData());
                rows.unshift(this.headers);

                if (this.summable.enabled) {
                    const sums = getSummedCols(this.getExportableData(), this.headers, this.summable.colIndexes);
                    rows.push(sums)
                }

                exportCsv(makeExportableCsv(rows), exportable.filename);
                break;
        }
    }

    render() {
        return html`
            <slot style="display: none"></slot>
            <input id="search" type="text" @keyup="${(ev: any) => {this.searchData(ev.path[0].value)}}">
            <button type="button" @click="${() => {this.reset()}}">Reset</button>
            ${this.perPageSelectorTemplate()}
            ${this.exportButtonsTemplate()}
            ${this.loading ? html `<div class="loader">Loading...</div>` : ''}
            ${this.tableTemplate()}
            ${this.paginationTemplate()}
        `
    }

    protected tableTemplate() {
        return html`
            <table>
                <thead>
                    <tr>
                        ${this.headers.map((header, i) => {
                            return html`<th @click="${() => {this.sortCol(i)}}">${header}</th>`})}                        
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

    protected exportButtonsTemplate() {
        return html`
            ${this.exportables.map((exportItem) => {
            if (exportItem.enabled) {
                return html`<button @click="${() => { this.export(exportItem)}}" type="button">${exportItem.type}</button>`
            }
        })}
        `
    }

    protected perPageSelectorTemplate() {
        if (this.paginatable.enabled) {
            return html`
                <select id="per-page" @change="${(ev) => {this.setResultsPerPage(ev.path[0].value)}}">
                    ${this.paginatable.perPageOptions.map((option) => {
                        return html`<option ?selected="${option === this.paginatable.resultsPerPage}" value="${option}">${option}</option>`
                    })}
                </select><span> results per page</span>`
        }
    }

    protected rowTemplate(row) {
        return html`
            <tr>
                ${row.map((cell) => {
                    return html`<td>${cell}</td>`
                })}
            </tr>
        `
    }

    protected filterTemplate() {
        if (this.filterable.enabled) {
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
        const options = uniqueValuesInCol(this.getActiveData(), key);

        return html`
            <td>
                <select @change="${(ev: any) => {this.filterCol(key, ev.path[0].value)}}">
                    <option value="">--${key}--</option>
                    ${options.map((opt) => {return html`<option value="${opt}">${opt}</option>`})}
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
                <button ?disabled="${this.currentPage <= 1}" @click="${() => {this.changePage(1)}}" type="button">First</button>
                <button ?disabled="${this.currentPage <= 1}" @click="${() => {this.prevPage()}}" type="button">&lt;&lt;Prev</button>
                <button ?disabled="${this.currentPage >= this.getTotalPages()}" @click="${() => {this.nextPage()}}" type="button">Next&gt;&gt;</button>
                <button ?disabled="${this.currentPage >= this.getTotalPages()}" @click="${() => {this.changePage(this.getTotalPages())}}" type="button">Last</button>
                <span>Page ${this.currentPage} of ${this.getTotalPages()}</span>
                <input id="go" type="number" min="1" max="${this.getTotalPages()}" value="${this.currentPage}">
                <button @click="${() => {this.gotoPage()}}" type="button">Go</button>
               <span>Showing ${this.getTotalDataItems()} of ${this.getTotalItems()}</span> 
            `
        }
    }

}
