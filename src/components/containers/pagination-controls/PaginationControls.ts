import {LitElement, html, property} from "@polymer/lit-element";
//import pureCss from "../../shared/pure-min.css"
import {connect} from "pwa-helpers/connect-mixin";
import {store} from "../../../state/store";
import {getCurrentPage, getResultsPerPage, getTotalPages} from "../../../state/reducers/paginationReducer";
import {getTotalActiveItems, getTotalItems} from "../../../state/reducers/dataReducer";
import {setPage} from "../../../state/actions";

export default class Pagination extends connect(store.instance())(LitElement) {

    public static componentName = 'pagination-controls';

    @property({type: Number})
    public currentPage: number = 1;

    @property({type: Number})
    public totalPages: number = 0;

    @property({type: Number})
    public totalItems: number = 0;

    @property({type: Number})
    public totalActiveItems: number = 0;

    @property({type: Number})
    public resultsPerPage: number = 0;

    stateChanged(state) {
        this.currentPage = getCurrentPage(state);
        this.totalPages = getTotalPages(state);
        this.totalItems = getTotalItems(state);
        this.totalActiveItems = getTotalActiveItems(state);
        this.resultsPerPage = getResultsPerPage(state);
    }

    render() {
        return html`
        <style></style>
        <button class="pure-button control-item" ?disabled="${this.currentPage <= 1}" @click="${() => {this.changePage(1)}}" type="button">First</button>
        <button class="pure-button control-item" ?disabled="${this.currentPage <= 1}" @click="${() => {this.prevPage()}}" type="button">&lt;&lt;Prev</button>
        <button class="pure-button control-item" ?disabled="${this.currentPage >= this.totalPages}" @click="${() => {this.nextPage()}}" type="button">Next&gt;&gt;</button>
        <button class="pure-button control-item" ?disabled="${this.currentPage >= this.totalPages}" @click="${() => {this.changePage(this.totalPages)}}" type="button">Last</button>
        <span class="control-item">Page ${this.currentPage} of ${this.totalPages}</span>
        <input id="go" class="control-item" type="number" min="1" max="${this.totalPages}" value="${this.currentPage}">
        <button class="pure-button control-item" @click="${() => {this.gotoPage()}}" type="button">Go</button>
        <span class="showing control-item right">Showing ${this.totalActiveItems} of ${this.totalItems}</span>`
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
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
        if (pageNum > this.totalPages) {
            pageNum = this.totalPages
        }
        if (pageNum < 1) {
            pageNum = 1;
        }
        this.currentPage = pageNum;
        store.dispatch(setPage(this.currentPage));
    }


    public gotoPage() {
        const pageInput: any = this.shadowRoot.querySelector('#go');
        this.changePage(Number(pageInput.value));
    }

}