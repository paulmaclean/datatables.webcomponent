import {LitElement, html} from "@polymer/lit-element";
import * as sampleData from '../generated.json';
import theme from "./theme.css"

export default class Theme extends LitElement {
    public static componentName = 'app';

    render() {
        return html`
            <example-data-table
                .theme="${theme}"
                .data="${sampleData.default}"
                .summable="${ {colIndexes: [2]} }"
                .filterable="${ {colIndexes: [5]} }"
                >
            </example-data-table>`
    }
}