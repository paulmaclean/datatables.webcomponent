import {parseTable} from "../../src/utils/table";

describe('table', () => {
    it('should convert an HTML table into a collection', () => {
        const table = makeTable(2, 2);
        expect(parseTable(table)).toEqual(
            [{'header-0': '0', 'header-1': '1'}, {'header-0': '0', 'header-1': '1'}]
        )
    });
});

const makeTable = (numRows, numCols) => {
    const table = document.createElement('table');
    makeHeader(table, numCols);
    makeTableBody(table, numRows, numCols);

    return table;
};

const makeHeader = (table, numCols) => {
    const header = table.createTHead();
    const row = header.insertRow(0);
    for (let i = 0; i < numCols; i++) {
        let headerCell = row.insertCell(i);
        headerCell.innerHTML = 'header-' + i;
    }
};

const makeTableBody = (table, numRows, numCols) => {
    let tbody = table.createTBody();
    for (let i = 0; i < numRows; i++) {
        const row = tbody.insertRow(0);
        for (let j = 0; j < numCols; j++) {
            const cell = row.insertCell(j);
            cell.innerHTML = j + '';
        }
    }
};