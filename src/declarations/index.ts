export interface KeyMap {
    [key: string]: any
}

export interface ExtensionOpts {
    enabled: boolean
}

export interface ColOpts extends ExtensionOpts {
    colIndexes: any
}

export interface SummableOpts extends ColOpts {
    formatter?: Function
}

export interface PaginateOpts extends ExtensionOpts {
    resultsPerPage: number
    perPageOptions: Array<number>
}

export interface AjaxOpts {
    url: string
}


export interface Exportable extends ExtensionOpts {
    type: string
    filename: string
}

export interface Filter {
    key: string
    value: string
}
