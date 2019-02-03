import {slice} from "lodash";
export const getPageSlice = (data: Array<any>, currentPage: number, perPage: number) => {
    let start = (currentPage - 1) * perPage;
    const end = start + perPage;

    return slice(data, start, end)
};

