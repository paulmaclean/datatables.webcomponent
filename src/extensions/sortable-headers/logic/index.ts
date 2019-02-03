import {sortBy, reverse} from "lodash";

export const toggleSort = (data: Array<any>, key: string, order: string) => {
    const sortedData = sortBy(data, [key]);

    if (order === 'ASC') {
        return reverse(sortedData);
    }

    return sortedData;
};