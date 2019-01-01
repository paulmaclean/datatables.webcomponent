import {LitElement, html} from "@polymer/lit-element";
import * as sampleData from './generated.json';
import {ColOpts, PaginateOpts, SummableOpts} from "../../src/declarations";

export default class App extends LitElement {
    public static componentName = 'app';

    render() {
        return html`
            <example-data-table 
                .data="${sampleData.default}"
                .summable="${this.summableOptions()}"
                .filterable="${this.filterableOptions()}"
                .paginatable="${this.paginatableOptions()}"
                >
            </example-data-table>`
    }

    filterableOptions(): ColOpts {
        return {colIndexes: [5], enabled: true}
    }

    summableOptions(): SummableOpts {
        return {colIndexes: [2], enabled: true, formatter: (val, index) => { return currencyFormatter.format(val) }}
    }

    paginatableOptions(): PaginateOpts {
        return {resultsPerPage: 5, enabled: true, perPageOptions: [5, 10, 15]}
    }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});
