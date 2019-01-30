export const SEARCH_DATA = 'SEARCH_DATA';


export const searchData = (payload) => {
    return {
        type: SEARCH_DATA,
        payload
    }
};