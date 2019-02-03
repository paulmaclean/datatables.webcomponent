import {pipe} from "./lambda";
import {getDependencies} from "./reselect";

let extendedSelectors = [];
let startState = null;

const findSelectorItem = (key: string) => {
    return extendedSelectors.find((selector) => {
        return selector.key === key;
    })
};

export const extendSelectorCreator = () => {
    return (key, ...funcs) => {
        const resultFunc = funcs.pop();
        const dependencies = getDependencies(funcs);
        const ex = (...args) => {
            const dependencyResults = dependencies.map((dependency) => {
                return dependency(startState);
            });
            return resultFunc.apply(null, [...args, ...dependencyResults])
        };

        extendedSelectors = extendedSelectors.map((extendedSelector) => {
            if (extendedSelector.key === key) {
                return {
                    ...extendedSelector,
                    extendedSelectors: [...extendedSelector.extendedSelectors, ex]
                }
            }
            return extendedSelector;
        });

        return pipedSelector(key);
    }
};

export const extendSelector = extendSelectorCreator();

export const createExtendableSelector = (key, func) => {
    const item = {
        key,
        extendedSelectors: [],
        startSelector: func
    };
    extendedSelectors.push(item);

    return (...args) => {
        startState = args[0];
        return pipedSelector(key).apply(null, args)
    }
};


export const pipedSelector = (key: string) => {
    const foundSelector = findSelectorItem(key);

    if (foundSelector.extendedSelectors.length > 0) {
        return pipe(foundSelector.startSelector, ...foundSelector.extendedSelectors)
    }
    return foundSelector.startSelector;
};