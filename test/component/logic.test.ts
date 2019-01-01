import {
    applyAllFilters,
    filterOnCol, getPageSlice,
    getSortedFlags,  searchData,
    sumOnCol,
    toggleFlag,
    toggleSortOnCol,
    uniqueValuesInCol, updateFilters
} from "../../src/component/logic";

import * as sampleData from '../support/data/generated.json';

describe('logic', () => {

    describe('toggleFlag', () => {
        it('should set the flag to 1 if flag is less than 1', () => {
            const flags = [-1];
            expect(toggleFlag(flags, 0)[0]).toBe(1);
        });

        it('should set the flag to 0 if flag is equal to 1', () => {
            const flags = [1];
            expect(toggleFlag(flags, 0)[0]).toBe(0);
        });
    });

    describe('getSortedFlags', () => {
        it('should set the flag to 0 if order is asc', () => {
            const flags = [-1];
            expect(getSortedFlags(flags, 0, 'asc')[0]).toBe(0);
        });

        it('should set the flag to 1 if order is desc', () => {
            const flags = [-1];
            expect(getSortedFlags(flags, 0, 'desc')[0]).toBe(1);
        });
    });

    describe('toggleSortOnCol', () => {
        it('should sort by a key in ascending order if the flag is less than 1', () => {
            const data = [{'x': 'b', 'y': '2'}, {'x': 'a', 'y': '3'}];
            expect(toggleSortOnCol(data, 0, 'x')).toEqual([{'x': 'a', 'y': '3'}, {'x': 'b', 'y': '2'}]);
        });

        it('should sort by a key in descending order if the flag is 1', () => {
            const data = [{'x': 'a', 'y': '3'}, {'x': 'b', 'y': '2'}];
            expect(toggleSortOnCol(data, 1, 'x')).toEqual([{'x': 'b', 'y': '2'}, {'x': 'a', 'y': '3'}]);
        });

        it('should sort by a key in descending order if the order param is set', () => {
            const data = [{'x': 'a', 'y': '3'}, {'x': 'b', 'y': '2'}];
            expect(toggleSortOnCol(data, 1, 'x')).toEqual([{'x': 'b', 'y': '2'}, {'x': 'a', 'y': '3'}]);
        });

    });

    describe('filterOnCol', () => {
        it('should filter on a key by value', () => {
            const data = [{'x': 'b', 'y': '2'}, {'x': 'a', 'y': '3'}, {'x': 'b', 'y': '3'}];

            expect(filterOnCol(data, 'x', 'b')).toEqual([{'x': 'b', 'y': '2'}, {'x': 'b', 'y': '3'}]);
        });

        it('should return the full dataset if query val is empty', () => {
            const data = [{'x': 'b', 'y': '2'}, {'x': 'a', 'y': '3'}, {'x': 'b', 'y': '3'}];

            expect(filterOnCol(data, 'x', '')).toEqual(data);
        });
    });

    describe('sumOnCol', () => {
        it('should sum a column', () => {
            const data = [{'x': 'b', 'y': '2'}, {'x': 'a', 'y': '3'}];

            expect(sumOnCol(data, 'y')).toEqual(5);
        });

    });

    describe('uniqueValuesInCol', () => {
        it('should find all the unique values in a col', () => {
            const data = [{'x': 'b', 'y': '2'}, {'x': 'a', 'y': '3'}, {'x': 'b', 'y': '3'}];

            expect(uniqueValuesInCol(data, 'x')).toEqual(['b', 'a']);
        });

    });

    describe('searchData', () => {
        it('should search all items in a collection and return the items that contain a matching value or substring (case insensitive)', () => {
            const data = [{'key1': 'FOO', 'key2': 'bAR'}, {'key1': 'foo', 'key3': 'bAr'}, {'key1': 'f', 'key3': 'b'}];

            expect(searchData(data, 'oo').length).toBe(2);
            expect(searchData(data, 'AR').length).toBe(2);
            expect(searchData(data, '').length).toBe(3);
        });

    });

    describe('applyAllFilters', () => {
        it('should apply all filters to the given dataset', () => {
            const data = [{'x': 'b', 'y': '2'}, {'x': 'a', 'y': '3'}, {'x': 'b', 'y': '3'}];
            const filters = [{key: 'x', value: 'b'}, {key: 'y', value: '2'}];

            expect(applyAllFilters(data, filters)).toEqual([{'x': 'b', 'y': '2'}]);
        });

    });

    describe('updateFilters', () => {
        it('should update the filters array given a key and val', () => {
            let filters = [{key: 'x', value: 'b'}, {key: 'y', value: '2'}];
            filters = updateFilters(filters, 'x', 'a');

            expect(filters[0]['value']).toEqual('a');
        });

    });

    // describe('resetFilters', () => {
    //     it('should set all filter values to null', () => {
    //         let filters = [{key: 'x', value: 'b'}, {key: 'y', value: '2'}];
    //         filters = resetFilters(filters);
    //         expect(filters[0]['value']).toBeNull();
    //         expect(filters[1]['value']).toBeNull();
    //     });
    // });

    describe('getPageSlice', () => {
        it('should get a slice of the array given the current page and per page amount', () => {
            let data:any = sampleData.default;
            const results = getPageSlice(data, 2, 10);

            expect(results.length).toEqual(10);
            expect(results[0].index).toEqual(10);
        });
    });

});
