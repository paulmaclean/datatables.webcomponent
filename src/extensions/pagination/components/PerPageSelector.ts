import {LitElement, html, property} from "@polymer/lit-element";
import {setResultsPerPage} from "../state/actions";
//import pureCss from "../../shared/pure-min.css"
import {connect} from "pwa-helpers/connect-mixin";
import {
    getPerPageOptions,
    getResultsPerPage,
} from "../state/reducer";
import {dispatch, getStore} from "../../../utils/extendableStore";

export default class PerPageSelector extends connect(getStore())(LitElement) {

    public static componentName = 'per-page-selector';

    // public static events = {
    //     'SET_RESULTS_PER_PAGE': 'set-results-per-page'
    // };

    // @property({type: String})
    // theme = pureCss;

    // @property({type: String})
    // styleOverrides = '';

    @property({type: Number})
    public options: Array<number> = [];

    @property({type: Number})
    public activeOption: number;

    stateChanged(state) {
        this.options = getPerPageOptions(state);
        this.activeOption = getResultsPerPage(state);
    }

    public createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <style></style>
            <div class="form flex-horizontal spaced">
                <select class="form-control" id="per-page" @change="${(ev) => {this.setResultsPerPage(ev.path[0].value)}}">
                    ${this.options.map((option) => {
                        return html`<option ?selected="${option === this.activeOption}" value="${option}">${option}</option>`
                    })}
                </select>
                <span class="spaced"> results per page</span>
            </div>
        `
    }

    setResultsPerPage(resultsPerPage: number) {
        dispatch(setResultsPerPage(resultsPerPage))
    }
}