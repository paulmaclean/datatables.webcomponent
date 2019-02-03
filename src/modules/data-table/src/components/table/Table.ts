import {LitElement, html, property} from "@polymer/lit-element";
import {connect} from "pwa-helpers/connect-mixin";
import {getStore} from "../../../../../utils/extendableStore";
import {getHeaders, getRows} from "../../state/reducer";
import {getSlottedContent} from "../../../../../utils/component";

export default class Table extends connect(getStore())(LitElement) {

    public static componentName = 'table';

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
        this.rows = getRows(state);
    }

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
                ${this.renderSlots()}
                ${this.renderStructure()}
            `
    }

    renderSlots() {
        return html`
            <slot style="display: none" name="table-headers"></slot>
            <slot style="display: none" name="extra-table-headers"></slot>
            <slot style="display: none" name="table-body"></slot>
        `
    }

    renderStructure() {
        return html`
            <div class="table-responsive">
                <table class="table table-striped table-bordered">
                    <thead>
                        ${getSlottedContent(this, 'table-headers', this.defaultHeaders())}
                        ${getSlottedContent(this, 'extra-table-headers')}
                    </thead>
                    <tbody>
                        ${getSlottedContent(this, 'table-body', this.defaultBody())}
                    </tbody>
                </table>
            </div>
        `
    }


    defaultHeaders() {
        return this.headers.map((header, i) => {
            return html`<span class="th">${header}</span>`
        })
    }

    defaultBody() {
        return this.rows.map((row) => {
            return html`
                <tr>
                    ${row.map((cell, i) => {
                        return html`<td>${cell}</td>`
                    })}
                </tr>
            `
        });
    }
}