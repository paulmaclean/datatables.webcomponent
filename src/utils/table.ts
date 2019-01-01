/**
 * generates factory functions to convert table rows to objects,
 * based on the titles in the table's <thead>
 * @param  {Array[String]} headings the values of the table's <thead>
 * @return {Function}      a function that takes a table row and spits out an object
 */
function factory(headings) {
    return function(row) {
        return Array.from(row.cells).reduce(function(prev, curr:any, i) {
            prev[headings[i]] = curr.innerText.trim();
            return prev;
        }, {});
    }
}

/**
 * given a table, generate an array of objects.
 * each object corresponds to a row in the table.
 * each object's key/value pairs correspond to a column's heading and the row's value for that column
 *
 * @param  {HTMLTableElement} table the table to convert
 * @return {Array[Object]}       array of objects representing each row in the table
 */
export const parseTable = (table) => {
    const headings = Array.from(table.tHead.rows[0].cells).map(function(heading:any) {
        return heading.innerText;
    });
    return Array.from(table.tBodies[0].rows).map(factory(headings));
};
