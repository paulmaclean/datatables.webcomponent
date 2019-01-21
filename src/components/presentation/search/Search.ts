import {LitElement, html, property} from "@polymer/lit-element";
import pureCss from "../../shared/pure-min.css"

export default class Search extends LitElement {
    public static componentName = 'search';
    public static events = {
        'SEARCH_DATA': 'search-data'
    };

    @property({type: String})
    theme = pureCss;

    @property({type: String})
    styleOverrides = '';

    render() {
        return html `
         <style>${this.theme + this.styleOverrides}</style>
         <input id="search" placeholder="Search..." type="text" @keyup="${(ev: any) => {
            this.searchData(ev.path[0].value)
        }}">
        `
    }

    searchData(queryVal: string) {
        this.emit(Search.events.SEARCH_DATA, {'queryVal': queryVal})
    }

    protected emit(name: string, payload) {
        this.dispatchEvent(new CustomEvent(name, {detail: payload}))
    }
}
