//import {sortBy, reverse, sumBy, uniqBy, map, slice} from "lodash";

// export const getSortedFlags = (flags: Array<number>, index: number, order = null) => {
//     if (order) {
//         return setFlagByOrder(flags, index, order)
//     } else {
//         return toggleFlag(flags, index);
//     }
// };
//
// export const toggleFlag = (flags: Array<number>, index: number) => {
//     return flags.map((flag, i) => {
//         if (i === index) {
//             if (flag < 1) return 1;
//             return 0
//         }
//         return -1
//     });
// };
//
// export const setFlagByOrder = (flags: Array<number>, index: number, order = 'desc') => {
//     return flags.map((flag, i) => {
//         if (i === index) {
//             if (order === 'desc') {
//                 return 1
//             } else {
//                 return 0
//             }
//         }
//         return -1
//     });
// };
//
// export const toggleSort = (data: Array<any>, key: string, order: string) => {
//     const sortedData = sortBy(data, [key]);
//
//     if (order === 'ASC') {
//         return reverse(sortedData);
//     }
//
//     return sortedData;
// };
//

// export const hasActiveFilter = (filters: Array<Filter>) => {
//     return filters.find((item) => {
//         return item.queryVal !== null && item.queryVal !== '';
//     })
// };
//
// export const isSelectedFilter = (filters: Array<Filter>, key: string) => {
//     return filters.find((item) => {
//         return item.queryVal !== null && item.queryVal !== '' && item.key === key;
//     })
// };
//
// export const sumOnCol = (data: Array<any>, key: string) => {
//     return sumBy(data, (o) => {
//         return Number(o[key]);
//     });
// };
//
//
//
//
// export const updateFilters = (filters: Array<Filter>, key: string, value: string) => {
//     return filters.map((filter) => {
//         if (filter.key === key) {
//             return {...filter, value}
//         }
//         return filter
//     })
// };
//
// export const resetFilters = (filters: Array<Filter>) => {
//     return filters.map((filter) => {
//         return {...filter, value: null}
//     });
// };
//
//
// export const getSummedCols = (data: Array<any>, headers: Array<string>, colIndexes: Array<number>, formatter?: Function) => {
//
//     return headers.map((key, i) => {
//         if (colIndexes.indexOf(i) !== -1) {
//             const sum = sumOnCol(data, key);
//             if (formatter) {
//                 return formatter(sum)
//             }
//             return sum;
//         }
//         return '';
//     })
// };