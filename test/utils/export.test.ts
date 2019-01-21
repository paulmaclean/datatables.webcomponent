import {makeExportableCsvContent} from "../../src/utils/export";

describe('array', () => {
    describe('makeExportableCsvContent', () => {
        it('should make an exportable csv string from an array of values', () => {
            const collection = [['abc', '123', 'efg']];

            expect(makeExportableCsvContent(collection)).toBe('abc,123,efg\r\n')
        });

        it('should remove inner comma values', () => {
            const collection = [['abc', '12,3', 'efg']];

            expect(makeExportableCsvContent(collection)).toBe('abc,12 3,efg\r\n')
        });
    });

});

