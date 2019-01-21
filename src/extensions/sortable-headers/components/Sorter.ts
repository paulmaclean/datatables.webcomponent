import {LitElement, html, property} from "@polymer/lit-element";
import {store} from "../../../state/store";
import {sortData} from "../state/actions";

export default class Sorter extends LitElement {
    public static componentName = 'sorter';

    @property({type: String})
    columnKey = '';

    @property({type: Number})
    sortFlag = -1;

    createRenderRoot() {
        return this;
    }

    render() {
        return html`
            <style></style>
            <div @click="${() => {this.sortCol(this.columnKey)}}">${this.columnKey} ${this.sortArrow()}</div> 
        `
    }

    sortCol(key: string) {
        this.setFlag();
        let order = this.sortFlag === 1 ? 'ASC' : 'DESC';
        store.dispatch(sortData({key, order}));
    }

    setFlag() {
        this.sortFlag = this.sortFlag === 0 ? 1 : 0;
    }

    sortArrow() {
        if (this.sortFlag === -1) {
            return html`<span class="arrow">&uarr;</span>`;
        }
        return this.sortFlag ? html`<span class="arrow active">&uarr;</span>` : html`<span class="arrow active">&darr;</span>`;
    }
}

