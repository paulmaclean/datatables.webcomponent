export const CHANGE_FILTERABLE_COLUMNS = 'CHANGE_FILTERABLE_COLUMNS';
export const FILTER_DATA = 'FILTER_DATA';


export const changeFilterableColumns = (payload) => {
    return {
        type: CHANGE_FILTERABLE_COLUMNS,
        payload
    }
};

export const filterData = (payload) => {
    return {
        type: FILTER_DATA,
        payload
    }
};