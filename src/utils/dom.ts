export const clearInputsFromArray = (el: HTMLElement, selectors: Array<string>, exceptions?: Array<string>) => {
    selectors.forEach((selector) => {
        clearInputs(el, selector, exceptions)
    });
};

export const clearInputs = (el: HTMLElement, selector: string, exceptions?: Array<string>) => {
    const inputs = Array.from(el.shadowRoot.querySelectorAll(selector));
    inputs.forEach((input: any) => {
        if (exceptions) {
            exceptions.forEach((exception) => {
                if (input.matches(exception)) {
                    return
                }
            })
        }
        input.value = '';
    });
};

