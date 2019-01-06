import {LitElement, html, property} from "@polymer/lit-element";
import pureCss from "../../shared/pure-min.css"
import {ExportableOpts} from "@p_mac/datatables.webcomponent/declarations";
import {collectionToValues} from "../../utils/array";
import {getSummedCols} from "../data-table/logic";
import {exportCsv, makeExportableCsv} from "../../utils/export";

export default class ExportButtons extends LitElement {

    public static componentName = 'export-buttons';

    public static events = {
        'CHANGE_PAGE': 'change-page'
    };

    @property({type: String})
    theme = pureCss;

    @property({type: String})
    styleOverrides = '';

    @property({type: Array})
    public exportables: Array<ExportableOpts>;

    @property({type: Array})
    public data: Array<any>;


    render() {
        return html`
            <style>${this.theme + this.styleOverrides}</style>
            ${this.exportables.map((exportItem) => {
                if (exportItem.enabled) {
                    return html`<button class="pure-button" @click="${() => {this.export(exportItem)}}" type="button">${exportItem.type}</button>`
                }
            })}
           `
    }

    export(exportable: ExportableOpts) {
        switch (exportable.type) {
            case 'csv':
                exportCsv(makeExportableCsv(this.data), exportable.filename);
                break;
        }
    }

}