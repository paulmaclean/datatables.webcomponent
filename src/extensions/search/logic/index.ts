import {isNumeric, isString} from "../../../utils/object";

export const searchData = (data: Array<any>, queryVal: any) => {
    if (!queryVal) return data;
    const results = [];
    data.forEach((row) => {
        for (let key in row) {
            let rowVal = row[key];

            if (isString(rowVal)) {
                rowVal = rowVal.toLowerCase();
            }

            if (isString(queryVal)) {
                queryVal = queryVal.toLowerCase();
            }

            if (rowVal == queryVal) {
                results.push(row);
                break;
            } else {
                if (isString(queryVal) && isString(rowVal)) {
                    if (rowVal.indexOf(queryVal) !== -1) {
                        results.push(row);
                        break
                    }
                } else {
                    if (isNumeric(queryVal)) {
                        const rowValS = rowVal.toString();
                        const queryValS = queryVal.toString();
                        if (rowValS.indexOf(queryValS) !== -1) {
                            results.push(row);
                            break
                        }
                    }
                }
            }
        }
    });

    return results;
};
