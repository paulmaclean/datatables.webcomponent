import {LitElement, html} from "@polymer/lit-element";
import * as sampleData from './generated.json';

export default class App extends LitElement {
    public static componentName = 'app';

    render() {
        return html`
            <example-data-table .data="${sampleData.default}">
                <example-table slot="middle">
                    <example-sortable-headers slot="table-headers"></example-sortable-headers>
                    <example-column-filters slot="extra-table-headers" .colsToFilter="${[4,5]}"></example-column-filters>
                </example-table>
                <example-pagination-controls slot="bottom"></example-pagination-controls>
            </example-data-table>`
    }
}

// const currencyFormatter = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2
// });