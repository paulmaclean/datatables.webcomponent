import {pipe} from "./lambda";

let selectorRegistryItems = [];

export const extendSelector = (original, selector, key) => {
    const found = findSelector(key);
    if (!found) {
        selectorRegistryItems.push({key, extendedSelectors: [selector], startSelector: null});
    } else {
        selectorRegistryItems = selectorRegistryItems.map((selectorRegistryItem) => {
            if (selectorRegistryItem.key === found.key) {
                return {
                    ...selectorRegistryItem,
                    extendedSelectors: [...selectorRegistryItem.extendedSelectors, selector]
                }
            }

            return selectorRegistryItem;
        })
    }

    return pipedSelector(key);
};

const findSelector = (key) => {
    return selectorRegistryItems.find((selector) => {
        return selector.key === key;
    })
};

export const getExtendable = (selector, key) => {
    let foundSelector = findSelector(key);
    if (!foundSelector) {
        foundSelector = {
            key,
            extendedSelectors: [],
            startSelector: selector
        };

        selectorRegistryItems.push(foundSelector);
    } else {
        if (!foundSelector.startSelector) {
            foundSelector.startSelector = selector
        }
    }
    return pipedSelector(key);
};

export const pipedSelector = (key) => {
    const foundSelector = findSelector(key);
    if (foundSelector.extendedSelectors.length > 0) {
        return pipe(foundSelector.startSelector, ...foundSelector.extendedSelectors)
    }
    return foundSelector.startSelector;
};