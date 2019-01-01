# Datatables.webcomponent

A lightweight webcomponent for creating datatables. Inspired by jQuery Datatables.

[Datatables.webcomponent Documentation](https://github.com/paulmaclean/datatables.webcomponent/wiki)

---

### Install

## npm
```
npm install @p_mac/datatables.webcomponent --save
```

---

### License

MIT

### Features

* Sortable columns
* Pagination
* Searchable
* Filterable columns
* Summable columns
* Load data via slotted table
* Load data via AJAX requests
* Export to `csv`

---

### Usage

#### LitElement
Example Usage

```typescript
    import {LitElement, html} from "@polymer/lit-element";
    import * as sampleData from './generated.json';
    import {ColOpts, PaginateOpts, SummableOpts} from "../../src/declarations";
    
    export default class App extends LitElement {
        public static componentName = 'app';
    
        render() {
            return html`
                <example-data-table 
                    .data="${sampleData.default}"
                    .summable="${this.summableOptions()}"
                    .filterable="${this.filterableOptions()}"
                    .paginatable="${this.paginatableOptions()}"
                    >
                </example-data-table>`
        }
    
        filterableOptions(): ColOpts {
            return {colIndexes: [5], enabled: true}
        }
    
        summableOptions(): SummableOpts {
            return {colIndexes: [2], enabled: true, formatter: (val, index) => { return currencyFormatter.format(val) }}
        }
    
        paginatableOptions(): PaginateOpts {
            return {resultsPerPage: 5, enabled: true, perPageOptions: [5, 10, 15]}
        }
    }
    
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    });
```

#### React
*Coming soon*

#### Vue
*Coming soon*  

####Standalone usage


```javascript
import {DataTable} from "simple-datatables"

const myTable = document.querySelector("#myTable");
const dataTable = new DataTable(myTable);

// or

const dataTable = new DataTable("#myTable");

```

You can also pass the options object as the second paramater:

```javascript
import {DataTable} from "simple-datatables"

const dataTable = new DataTable("#myTable", {
	searchable: false,
	fixedHeight: true,
	...
})
```