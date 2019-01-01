import {htmlStringToElement} from "../../src/utils/html";

describe('html', () => {
    describe('htmlStringToElement', () => {
        it('should add a component to the custom element registry', () => {
            const el:any = htmlStringToElement('<div id="container"><span id="child"></span></div>');

            expect(el).toBeDefined();
            expect(el.children[0].constructor.name).toEqual('HTMLSpanElement')
        });
    });
});