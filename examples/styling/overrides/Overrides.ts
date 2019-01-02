import {LitElement, html} from "@polymer/lit-element";
import * as sampleData from '../generated.json';
import overrides from "./overrides.css"

export default class Overrides extends LitElement {
    public static componentName = 'app';

    render() {
        return html`
            <example-data-table
                .styleOverrides="${overrides}"
                .data="${sampleData.default}"
                .summable="${ {colIndexes: [2]} }"
                .filterable="${ {colIndexes: [5]} }"
                >
            </example-data-table>`
    }
}