import {LitElement, html, property} from "@polymer/lit-element";
import psuedoTable from "../../../shared/psuedo-table.css"
import {connect} from "pwa-helpers/connect-mixin";
import {store} from "../../../state/store";
import {defineComponent} from "../../..";
import Sorter from "./Sorter";
import {getHeaders} from "../../../state/reducers/dataReducer";

export default class SortableHeaders extends connect(store.instance())(LitElement) {
    public static componentName = 'sortable-headers';

    @property({type: Array})
    exceptions = [];

    @property({type: String})
    columnKey = '';

    @property({type: Number})
    sortFlag = -1;

    @property({type: Array})
    headers: Array<any>;

    stateChanged(state) {
        this.headers = getHeaders(state);
    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super['connectedCallback']();
        this['classList'].add('table-tr');
    }

    render() {
        return html `
            <style>${psuedoTable}</style>
            ${this.headers.map((header, i) => {
                if (this.exceptions.indexOf(i) !== -1) {
                    return html `
                        <span class="table-th">${header}</span>`
                } else {
                    return html `
                        <span class="table-th">
                            <slot name="sorter">
                                <data-table-sorter columnKey="${header}"></data-table-sorter>
                            </slot>                   
                        </span>`
                }
            })}
            `
        }
}

defineComponent(Sorter.componentName, Sorter, 'data-table');