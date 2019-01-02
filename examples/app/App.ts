import {LitElement, html} from "@polymer/lit-element";
import * as sampleData from './generated.json';

export default class App extends LitElement {
    public static componentName = 'app';

    render() {
        return html`
            <example-data-table 
                .data="${sampleData.default}"
                .summable="${ {colIndexes: [2], formatter: (val, index) => { return currencyFormatter.format(val)}} }"
                .filterable="${ {colIndexes: [5]} }"
                .paginatable="${ {resultsPerPage: 5} }"
                .exportables="${ {resultsPerPage: 5} }"
                >
            </example-data-table>`
    }
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
});
