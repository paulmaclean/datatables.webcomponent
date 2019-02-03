import {LitElement, html, property} from "@polymer/lit-element";
import * as sampleData from './generated.json';
import purecss from './css/purecss.css'
import bootstrap from './css/bootstrap.css'
import defaultTheme from './css/defaultTheme.css'
import customTheme from './css/customTheme.css'

export default class App extends LitElement {
    public static componentName = 'app';

    @property({type: String})
    protected theme = bootstrap + ' ' + defaultTheme
    // protected theme = convertTheme(purecss, [
    //     {find: 'pure-table', replace: 'table'},
    //     {find: 'pure-form', replace: 'form'},
    //     {find: 'pure-button', replace: 'btn'}]) + ' ' + defaultTheme;

    render() {
        return html`
            <style>${this.theme}</style>
            <select @change="${(ev) => {this.changeTheme(ev.path[0].value)}}">
                <option value="bootstrap">Bootstrap</option>
                <option value="pureCss">PureCss</option>
                <option value="custom">Custom</option>
            </select>
            <example-data-table .data="${sampleData.default}">
                
                <div slot="top" class="form flex-horizontal">
                    <example-search></example-search>
                    <example-per-page-selector></example-per-page-selector>
                </div>
                
                <example-table slot="middle">
                    <example-sortable-headers slot="table-headers"></example-sortable-headers>
                    <example-column-filters slot="extra-table-headers" .filterableColumns="${[4, 5]}"></example-column-filters>
                </example-table>
                
                <example-pagination-controls slot="bottom"></example-pagination-controls>
            </example-data-table>`
    }

    changeTheme(theme) {
        switch (theme) {
            case 'bootstrap':
                this.theme = bootstrap + ' ' + defaultTheme;
                break;
            case 'custom':
                this.theme = customTheme + ' ' + defaultTheme;
                break;
            case 'pureCss':
                this.theme = convertTheme(purecss, [
                    {find: 'pure-table', replace: 'table'},
                    {find: 'pure-form', replace: 'form'},
                    {find: 'pure-button', replace: 'btn'}]) + ' ' + defaultTheme;
                break;

        }
    }
}

export const convertTheme = (theme, extras = []) => {
    let convertedTheme = theme;
    // let replacements = ['thead', 'tbody', 'tfoot', 'tr', 'th', 'td']
    // replacements.forEach((replacement) => {
    //     convertedTheme = replaceAll(convertedTheme, replacement, '.' + replacement);
    // })

    extras.forEach((extra) => {
        convertedTheme = replaceAll(convertedTheme, extra.find, extra.replace);
    })

    return convertedTheme;
}

function replaceAll(str, find, replace) {
    return str.replace(new RegExp("\\b" + find + "\\b", 'g'), replace);
}

// const currencyFormatter = new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2
// });