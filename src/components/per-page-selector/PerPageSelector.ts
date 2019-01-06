import {LitElement, html, property} from "@polymer/lit-element";
import pureCss from "../../shared/pure-min.css"

export default class PerPageSelector extends LitElement {

    public static componentName = 'per-page-selector';

    public static events = {
        'SET_RESULTS_PER_PAGE': 'set-results-per-page'
    };

    @property({type: String})
    theme = pureCss;

    @property({type: String})
    styleOverrides = '';

    @property({type: Number})
    public options: Array<number> = [];

    @property({type: Number})
    public activeOption: number;

    render() {
        return html`
            <style>${this.theme + this.styleOverrides}</style>
            <select id="per-page" @change="${(ev) => {this.setResultsPerPage(ev.path[0].value)}}">
                ${this.options.map((option) => {
                    return html`<option ?selected="${option === this.activeOption}" value="${option}">${option}</option>`
                })}
            </select>
            <span> results per page</span>
        `
    }

    setResultsPerPage(resultsPerPage: number) {
        this.emit(PerPageSelector.events.SET_RESULTS_PER_PAGE, {resultsPerPage})
    }

    protected emit(name: string, payload) {
        this.dispatchEvent(new CustomEvent(name, {detail: payload}))
    }
}