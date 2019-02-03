import {LitElement, html, property} from "@polymer/lit-element";
import {connect} from "pwa-helpers/connect-mixin";
import Sorter from "./Sorter";
import {getStore} from "../../../utils/extendableStore";
import {getHeaders} from "../../../modules/data-table/src/state/reducer";
import {defineComponent} from "../../../utils/component";

export default class SortableHeaders extends connect(getStore())(LitElement) {
    public static componentName = 'sortable-headers';

    @property({type: Array})
    exceptions = [];

    @property({type: String})
    columnKey = '';

    @property({type: Number})
    sortFlag = -1;

    @property({type: Array})
    headers: Array<any>;

    @property({type: Object})
    theme = '';

    stateChanged(state) {
        this.headers = getHeaders(state);
    }

    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super['connectedCallback']();
        this['classList'].add('tr');
    }

    render() {
        return html `
            <style>.tr {display: table-row;}</style>
            ${this.headers.map((header, i) => {
                if (this.exceptions.indexOf(i) !== -1) {
                    return html `
                        <th>${header}</th>`
                } else {
                    return html `
                        <th>
                            <slot name="sorter">
                                <data-table-sorter columnKey="${header}"></data-table-sorter>
                            </slot>                   
                        </th>`
                }
            })}
            `
        }
}

defineComponent(Sorter.componentName, Sorter, 'data-table');