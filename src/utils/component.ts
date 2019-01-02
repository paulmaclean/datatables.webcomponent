import {isElement, isObject, tryParse} from "./object";
import {values} from "lodash";

export const defineComponent = (tagName: string, constructor: Function, namespace = 'app') => {
    tagName = `${namespace}-${tagName}`;
    if (!customElements.get(tagName)) customElements.define(tagName, constructor);
    return customElements.get(tagName);
};

export const findInSlot = (element, selector): any => {
    const found = getSlotElements(element).filter((element) => {
        return element.matches(selector);
    });
    return found[0];
};

export const datasetToProps = (el: HTMLElement) => {
    for (let key in el.dataset) {
        if (el[key]) {
            const dataVal = tryParse(el.dataset[key]);
            if (isObject(dataVal)) {
                for (let subKey in dataVal) {
                    el[key][subKey] = dataVal[subKey];
                }
            } else {
                el[key] = dataVal;
            }
        }
    }
};

export const mergeDefaults = (el: HTMLElement, mergeableProps: Array<string>) => {
    mergeableProps.forEach((mergeableProp) => {
        if (el[`${mergeableProp}Defaults`]) {
            if (Array.isArray(el[mergeableProp])) {
                el[mergeableProp] = [...el[`${mergeableProp}Defaults`], ...el[mergeableProp]]
            } else {
                el[mergeableProp] = {...el[`${mergeableProp}Defaults`], ...el[mergeableProp]}
            }

        }
    })
};

const getSlotElements = (element): any => {
    return values(slotAssignedElements(getSlot(element)));
};

const getSlot = (element): HTMLSlotElement => {
    const root = element.shadowRoot || element;
    return root.querySelector('slot')
};

const slotAssignedElements = (slot) => {
    if (!slot || !slot.assignedNodes) return;
    return slot.assignedNodes().map((node) => {
        if (node.nodeName === 'SLOT') {
            return slotAssignedElements(node)
        }
        if (isElement(node)) {
            return <HTMLElement>node;
        }
    }).filter(element => element)
};