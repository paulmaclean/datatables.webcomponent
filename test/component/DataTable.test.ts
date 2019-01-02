import {defineComponent} from "../../src";
import DataTable from "../../src/component/DataTable";
import {htmlStringToElement} from "../../src/utils/html";
import * as sampleData from '../support/data/generated.json';

describe('DataTable', () => {

    describe('firstUpdated', () => {
        let dataTable: DataTable = null;
        beforeEach(function (done) {
            makeEmptyDataTable();
            getDataTable().then((result: DataTable) => {
                dataTable = result;
            });
            done();
        });

        it('should call initFromTable if the data and ajax props are not set and there is a slotted table', (done) => {
            makeSlottedDataTable();
            getDataTable().then((result: DataTable) => {
                dataTable = result;
                spyOn(dataTable, 'init');
                dataTable.firstUpdated();
                expect(dataTable.init).toHaveBeenCalled();
                done();
            });
        })
    });

    describe('init', () => {
        it('should initialize the data from a slotted table', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                expect(dataTable.data.length).toBeGreaterThan(0);
                done();
            })
        });

        it('should initialize the data from a given dataset', (done) => {
            makeEmptyDataTable();
            getDataTable().then((dataTable: DataTable) => {
                const imported: any = sampleData.default;
                dataTable.init(imported);

                expect(dataTable.data.length).toBeGreaterThan(0);
                done();
            })
        });

        it('should set the headers', (done) => {
            makeEmptyDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.init(sampleData.default);

                expect(dataTable.headers.length).toEqual(Object.keys(sampleData.default[0]).length);
                done();
            })
        });

        it('should set the rows', (done) => {
            makeEmptyDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.init(sampleData.default);
                expect(dataTable.rows.length).toBeGreaterThan(0);
                done();
            })
        });
    });

    describe('updateData', () => {
        it('should call the refreshData method', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                spyOn(dataTable, 'refreshData');
                dataTable.updateData(sampleData.default);

                expect(dataTable.refreshData).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('refreshData', () => {
        it('should set the rows property from the given data', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.refreshData([{'Header 1': '3', 'Header 2': '3'}, {'Header 1': '4', 'Header 2': '4'}]);

                expect(dataTable.rows).toEqual([['3', '3'], ['4', '4']]);
                done();
            })

        });

        it('should throw an error if the headers do not match', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                expect(function () {
                    dataTable.refreshData([{'SomeHeader': '1'}])
                }).toThrowError();
                done();
            })
        });
    });

    describe('sortOnCol', () => {
        it('should call the refreshData method', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                spyOn(dataTable, 'refreshData');
                dataTable.sortCol(0);

                expect(dataTable.refreshData).toHaveBeenCalled();
                done();
            });
        });

        it('should sort the table given an order', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.sortCol(0, 'desc');
                expect(dataTable.rows).toEqual([['2', '2'], ['1', '3']]);
                dataTable.sortCol(0, 'asc');

                expect(dataTable.rows).toEqual([['1', '3'], ['2', '2']]);
                done();
            })

        });
    });

    describe('filterOnCol', () => {
        it('should call the refreshData method', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                spyOn(dataTable, 'refreshData');
                dataTable.filterCol('Header 1', 1);

                expect(dataTable.refreshData).toHaveBeenCalled();
                done();
            });
        });
    });

    describe('getActiveData', () => {
        it('should return the full dataset if there has not been a search', (done) => {
            makeEmptyDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.init(sampleData.default);
                expect(dataTable.getActiveData().length).toEqual(sampleData.default.length);
                done();
            });
        });

        it('should return the a subset of the dataset if there has been a search', (done) => {
            makeEmptyDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.init(sampleData.default);
                dataTable.searchData('female');
                expect(dataTable.getActiveData().length).toEqual(14);
                done();
            });
        });
    });

    describe('getExportableData', () => {
        it('should return the data for export', (done) => {
            makeEmptyDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.init(sampleData.default);
                expect(dataTable.getExportableData().length).toEqual(sampleData.default.length);
                done();
            });
        });
    });

    describe('reset', () => {
        let dataTable = null;

        beforeEach(function (done) {
            makeSlottedDataTable();
            getDataTable().then((result: DataTable) => {
                dataTable = result;
            });
            done();
        });

        it('should call the refreshData method', () => {
            spyOn(dataTable, 'refreshData');
            dataTable.reset();

            expect(dataTable.refreshData).toHaveBeenCalled();
        });


        it('should empty the searched data', () => {
            dataTable.searchData('male');
            dataTable.reset();

            expect(dataTable.searchedData.length).toBe(0);
        });

    });

    describe('nextPage', () => {
        it('should increase the currentPage', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.init(sampleData.default);
                dataTable.nextPage();
                expect(dataTable.currentPage).toBe(2);
                done();
            });
        });
    });

    describe('prevPage', () => {
        it('should decrease the currentPage', (done) => {
            makeSlottedDataTable();
            getDataTable().then((dataTable: DataTable) => {
                dataTable.init(sampleData.default);
                dataTable.changePage(3);
                dataTable.prevPage();
                expect(dataTable.currentPage).toBe(2);
                done();
            });
        });
    });

    //Features
    it('should paginate on the searched data', (done) => {
        makeEmptyDataTable();
        getDataTable().then((dataTable: DataTable) => {
            dataTable.init(sampleData.default);
            dataTable.searchData('female');

            expect(dataTable.getActiveData().length).toBe(14);
            expect(dataTable.getTotalPages()).toBe(2);
            done();
        })
    });

    it('should paginate on the searched and filtered data', (done) => {
        makeEmptyDataTable();
        getDataTable().then((dataTable: DataTable) => {
            dataTable.init(sampleData.default);
            dataTable.searchData('female');
            dataTable.changePage(2);
            dataTable.filterCol('company', 'XIXAN');

            expect(dataTable.data.length).toBe(1);
            done();
        });
    });

    it('should paginate after the results per page is set', (done) => {
        makeEmptyDataTable();
        getDataTable().then((dataTable: DataTable) => {
            dataTable.init(sampleData.default);
            dataTable.setResultsPerPage(5);
            dataTable.nextPage();
            expect(dataTable.data.length).toBe(5);
            done();
        });
    });

});

const getDataTable = (): Promise<DataTable> => {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve(document.querySelector('test-data-table') as DataTable);
        }, 0);
    });
};

const makeSlottedDataTable = () => {
    document.body.innerHTML = '';
    defineComponent(DataTable.componentName, DataTable, 'test');
    document.body.appendChild(makeTableEl());
};

const makeEmptyDataTable = () => {
    document.body.innerHTML = '';
    defineComponent(DataTable.componentName, DataTable, 'test');
    document.body.appendChild(htmlStringToElement(`<test-data-table></test-data-table>`));
};

const makeTableEl = () => {
    return htmlStringToElement(`
                    <test-data-table>
                        <table>
                            <thead>
                                <tr>
                                    <th>Header 1</th>
                                    <th>Header 2</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                     <td>1</td>
                                     <td>3</td>
                                 </tr>
                                 <tr>
                                     <td>2</td>
                                     <td>2</td>
                                 </tr>
                            </tbody>
                        </table>
                    </test-data-table>
            `);
};