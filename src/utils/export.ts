export const makeExportableCsv = (rows: Array<any>) => {
    let csvContent = "";
    rows.forEach(function(rowArray){
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

export const exportCsv = (csvBlob: Blob, filename:string) => {
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