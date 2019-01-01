export const makeExportableCsv = (rows: Array<any>) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    rows.forEach(function(rowArray){
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });

    return csvContent;
};

export const exportCsv = (csvContent: string, filename:string) => {
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);

    link.click();
};
