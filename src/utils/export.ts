import {isString} from "./object";


export const makeExportableCsvContent = (rows: Array<any>) => {
    let csvContent = "";

    rows.forEach(function (rowArray) {
        let rowItems = rowArray.map((item) => {
            if (isString(item) && item.indexOf(',') !== -1) {
                item = item.replace(/,/g, ' ');
                item = item.replace(',', ' ')
            }
            return item
        });
        let row = rowItems.join(",");
        csvContent += row + "\r\n";
    });

    return csvContent
};

export const makeExportableCsv = (rows: Array<any>) => {
    return new Blob([makeExportableCsvContent(rows)], {type: 'text/csv;charset=utf-8;'});
};

export const exportCsv = (csvBlob: Blob, filename: string) => {
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(csvBlob, filename);
    } else {
        const link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(csvBlob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
};