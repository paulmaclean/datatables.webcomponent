import {RECEIVE_DATA, RECEIVE_ERROR, REQUEST_DATA, SET_PAGE} from "./types";
import {isCollection} from "../utils/array";

export const requestData = () => {
    return {
        type: REQUEST_DATA
    }
};

export const receiveData = (payload) => {
    return {
        type: RECEIVE_DATA,
        payload
    }
};

export const receiveError = (payload) => {
    return {
        type: RECEIVE_ERROR,
        payload
    }
};

export function fetchData(url) {
    return function (dispatch) {
        dispatch(requestData());

        fetch(url)
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                if (!isCollection(data)) {
                    throw new Error('The dataset is not a uniform array of objects. You may need to pre-process the returned data and use the data property')
                }
                dispatch(receiveData(data));
            }).catch((err) => {
            dispatch(receiveError(err));
        });
    }
}

export const setPage = (payload) => {
    return {
        type: SET_PAGE,
        payload
    }
};
