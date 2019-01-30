import {compose, compound, pipe} from "../../src/utils/lambda";
import {isFunction} from "../../src/utils/object";

let selectorRegistryItems = [];

export const extendSelector = (original, selector) => {

    const found = findSelector(original.name);
    if (!found) {
        selectorRegistryItems.push({key: original.name, extendedSelectors: [selector], startSelector: null});
    } else {
        selectorRegistryItems = selectorRegistryItems.map((selectorRegistryItem) => {
            if (selectorRegistryItem.key === found.key) {
                return {...selectorRegistryItem, extendedSelectors: [...selectorRegistryItem.extendedSelectors, selector]}
            }

            return selectorRegistryItem;
        })
    }

    return pipedSelector(original.name);
};

const findSelector = (key) => {
    return selectorRegistryItems.find((selector) => {
        return selector.key === key;
    })
};

export const getExtendable = (state, selector) => {
    const foundSelector = findSelector(selector.name);

    if(!foundSelector) {
        selectorRegistryItems.push({key: selector.name, extendedSelectors: [], startSelector: selector});
    }

    if (!foundSelector.startSelector) {
        foundSelector.startSelector = selector
    }

    return pipedSelector(foundSelector.startSelector.name)(state);
};

export const pipedSelector = (key) => {
    const foundSelector = findSelector(key);
    if (foundSelector.extendedSelectors.length > 0) {
        return pipe(foundSelector.startSelector, ...foundSelector.extendedSelectors)
    }
    return foundSelector.startSelector;
};