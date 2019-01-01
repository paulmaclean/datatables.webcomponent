import {collectionToValues, isCollection} from "../../src/utils/array";

describe('array', () => {
    describe('collectionToValues', () => {
        it('should build an array of values from an collection', () => {
            const collection = [{'a': 1, 'b': 2}, {'x': 3, 'y': 4}];

            expect(collectionToValues(collection)).toEqual([[1, 2], [3, 4]])
        });
    });

    describe('isCollection', () => {
        it('should return true if the array is a uniform collection', () => {
            const collection = [{'a': 1, 'b': 2}, {'a': 3, 'b': 4}];

            expect(isCollection(collection)).toBe(true)
        });

        it('should return false if the array is not uniform collection', () => {
            let collection: any = [{'a': 1, 'b': 2}, {'x': 3, 'b': 4}];

            expect(isCollection(collection)).toBe(false);

            collection = ['a', 'b'];

            expect(isCollection(collection)).toBe(false)
        });
    });
});
