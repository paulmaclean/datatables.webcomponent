export interface AppState {
    data: any,
    pagination: PaginateOpts
}

export interface Data {
    original: Array<any>,
    active: Array<any>
}

export interface KeyMap {
    [key: string]: any
}

export interface ReducerMap {
    key: string
    reducer: Function
}

export interface ExtensionOpts {
    enabled: boolean
}

export interface OrderableOpts extends ExtensionOpts {
    column: number,
    order: string
}

export interface ColOpts extends ExtensionOpts {
    colIndexes: Array<number>
}

export interface FilterableOpts {
    colsToFilter: Array<string>,
    activeFilters: Array<number>
}

export interface SortableOpts extends ExtensionOpts {
    exceptCols: Array<any>
}

export interface RenderableOpts extends ColOpts {

}

export interface SummableOpts extends ColOpts {
    formatter?: Function
}

export interface PaginateOpts extends ExtensionOpts{
    currentPage: number
    resultsPerPage: number
    perPageOptions: Array<number>
}

export interface AjaxOpts {
    url: string
}


export interface ExportableOpts extends ExtensionOpts {
    type: string
    filename: string
}

export interface Filter {
    key: string
    queryVal: string
}
