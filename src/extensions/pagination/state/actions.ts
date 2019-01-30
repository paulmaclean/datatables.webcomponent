export const SET_PAGE = 'SET_PAGE';
export const SET_RESULTS_PER_PAGE ='SET_RESULTS_PER_PAGE';

export const setPage = (payload) => {
    return {
        type: SET_PAGE,
        payload
    }
};

export const setResultsPerPage = (payload) => {
    return {
        type: SET_RESULTS_PER_PAGE,
        payload
    }
};