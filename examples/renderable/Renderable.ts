

import {LitElement, html} from "@polymer/lit-element";

export default class Renderable extends LitElement {
    public static componentName = 'renderable';

    render() {
        return html`
            <example-data-table
                .data="${this.getData()}"
                .renderable="${ {colIndexes: [2, 3]} }"
                .sortable="${ {exceptCols: [2, 3]} }"
                >
            </example-data-table>`
    }

    getData() {
        let items = [];

        for (let i = 0; i < 10; i++) {
            items.push({id: i, name: `item_${i}`})
        }

        items = items.map((item) => {
            const editLink = `<a href="/edit/${item.id}">Edit</a>`;
            const deleteForm = `<form method="DELETE" action="/delete/${item.id}">
                                    <button type="submit">Delete</button>         
                                 </form>`;
            return {...item, edit: editLink, 'delete': deleteForm}
        });

        return items;
    }
}