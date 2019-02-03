import {LitElement, html, property} from "@polymer/lit-element";
import {searchData} from "../state/actions";
import {dispatch} from "../../../utils/extendableStore";

export default class Search extends LitElement {
    public static componentName = 'search';

    render() {
        return html `
         <style></style>
         <input id="search" class="form-control" placeholder="Search..." type="text" @keyup="${(ev: any) => {
            this.searchData(ev.path[0].value)
        }}">
        `
    }

    public createRenderRoot() {
        return this;
    }

    searchData(queryVal: string) {
        dispatch(searchData({queryVal}));
    }

}
