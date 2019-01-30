export const isObject = (obj) => {
    return typeof obj === 'object' && obj !== null
};

export const shallowEquals = (obj1, obj2) => {
    return JSON.stringify(obj1) === JSON.stringify(obj2)
};

export const isEmpty = (obj) => {
    return !obj || !Object.keys(obj).length
};

export const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n) && isPrimitive(n);
};

export const isString = (val) => {
    return typeof val === 'string';
};

export const isPrimitive = (obj) => {
    return (obj !== Object(obj));
};

export const isFunction = (functionToCheck) => {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

export const isDefined = (item) => {
    return typeof item !== 'undefined' && item !== null && item !== "null";
};

export const isElement = (obj) => {
    return (
        typeof HTMLElement === "object" ? obj instanceof HTMLElement : //DOM2
            obj && typeof obj === "object" && obj !== null && obj['nodeType'] === 1 && typeof obj['nodeName'] === "string"
    );
};

export const tryParse = (originalVal) => {
    try {
        return JSON.parse(originalVal);
    } catch (e) {
        return originalVal;
    }
};

export const tryStringify = (originalVal) => {
    if (isPrimitive(originalVal)) return originalVal;
    try {
        return JSON.stringify(originalVal);
    } catch (e) {
        return originalVal;
    }
};