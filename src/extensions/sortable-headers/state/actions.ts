export const SORT_DATA = 'SORT_DATA';

export interface SortDataPayload {
    key: string,
    order: string
}

export const sortData = (payload: SortDataPayload) => {
    return {
        type: SORT_DATA,
        payload
    }
};
