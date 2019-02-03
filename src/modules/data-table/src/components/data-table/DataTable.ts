import {LitElement, html, property} from "@polymer/lit-element";
import {dispatch} from "../../../../../utils/extendableStore";
import {fetchData, receiveData} from "../../state/actions";
import {findInSlot} from "../../../../../utils/component";
import {parseTable} from "../../../../../utils/table";

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
            dispatch(receiveData(data));
            return
        }

        //Data sent in via a property
        if (this.data.length) {
            dispatch(receiveData(this.data));
            return
        }

        //Data fetched from url via a property
        if (this.ajax.url) {
            dispatch(fetchData(this.ajax.url));
            return
        }

        //Slotted table data
        const table = findInSlot(this, 'table');
        if (table) {
            dispatch(receiveData(parseTable(table)));
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