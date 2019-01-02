import {sortBy, reverse, sumBy, uniqBy, map, slice} from "lodash";
import {Filter} from "../declarations";
import {isString} from "../utils/object";

export const getSortedFlags = (flags: Array<number>, index: number, order = null) => {
    if (order) {
        return setFlagByOrder(flags, index, order)
    } else {
        return toggleFlag(flags, index);
    }
};

export const toggleFlag = (flags: Array<number>, index: number) => {
    return flags.map((flag, i) => {
        if(i === index) {
            if(flag < 1) return 1;
            return 0
        }
        return - 1
    });
};

export const setFlagByOrder = (flags: Array<number>, index: number, order = 'desc') => {
    return flags.map((flag, i) => {
        if(i === index) {
            if (order === 'desc') {
                return 1
            } else {
                return 0
            }
        }
        return - 1
    });
};

export const toggleSortOnCol = (data: Array<any>, columnFlag: number, key: string) => {
    const sortedData = sortBy(data, [key]);

    if (columnFlag > 0) {
        return reverse(sortedData);
    }

    return sortedData;
};

export const filterOnCol = (data: Array<any>, key: string, queryVal: string) => {
    if (!queryVal) {
        return data;
    }

    return data.filter((item) => {
        return item[key] == queryVal;
    });
};

export const hasActiveFilter = (filters: Array<Filter>) => {
    return filters.find((item) => {
        return item.value !== null && item.value !== '';
    })
};

export const isActiveFilter = (filters: Array<Filter>, key: string) => {
    return filters.find((item) => {
        return item.value !== null && item.value !== '' && item.key === key;
    })
};

export const sumOnCol = (data: Array<any>, key: string) => {
    return sumBy(data, (o) => {
        return Number(o[key]);
    });
};

export const uniqueValuesInCol = (data: Array<any>, key: string) => {
    return map(uniqBy(data, key), key);
};

export const searchData = (data: Array<any>, queryVal: string) => {
    if (!queryVal) return data;
    const results = [];
    data.forEach((row) => {
        for (let key in row) {
            let rowVal = row[key];

            if (isString(rowVal)) {
                rowVal = rowVal.toLowerCase();
            }

            if (isString(queryVal)) {
                queryVal = queryVal.toLowerCase();
            }

            if (rowVal == queryVal) {
                results.push(row);
                break;
            } else {
                if (isString(queryVal) && isString(rowVal)) {
                    if (rowVal.indexOf(queryVal) !== -1) {
                        results.push(row);
                        break
                    }
                }
            }
        }
    });

    return results;
};


export const applyAllFilters = (data: Array<any>, filters: Array<Filter>) => {
    filters.forEach((filter) => {
        if (filter.value) {
            data = filterOnCol(data, filter.key, filter.value)
        }
    });
    return data;
};

export const updateFilters = (filters: Array<Filter>, key: string, value: string) => {
    return filters.map((filter) => {
        if (filter.key === key) {
            return {...filter, value}
        }
        return filter
    })
};

export const resetFilters = (filters: Array<Filter>) => {
    return filters.map((filter) => {
        return {...filter, value: null}
    });
};

export const getPageSlice = (data: Array<any>, currentPage: number, perPage: number) => {
    let start = (currentPage - 1) * perPage;
    const end = start + perPage;

    return slice(data, start, end)
};

export const getSummedCols = (data: Array<any>, headers: Array<string>, colIndexes: Array<number>, formatter?: Function) => {

    return headers.map((key, i) => {
        if (colIndexes.indexOf(i) !== -1) {
            const sum = sumOnCol(data, key);
            if (formatter) {
                return formatter(sum)
            }
            return sum;
        }
        return '';
    })
};