import {LitElement, html, property} from "@polymer/lit-element";
import {store} from "../../../state/store";
import {searchData} from "../state/actions";

export default class Search extends LitElement {
    public static componentName = 'search';

    render() {
        return html `
         <style></style>
         <input id="search" placeholder="Search..." type="text" @keyup="${(ev: any) => {
            this.searchData(ev.path[0].value)
        }}">
        `
    }

    searchData(queryVal: string) {
        store.dispatch(searchData({queryVal}));
    }

}
