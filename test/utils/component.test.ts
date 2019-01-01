import {defineComponent} from "../../src";
import {findInSlot} from "../../src/utils/component";
import {htmlStringToElement} from "../../src/utils/html";

describe('component', () => {
    describe('defineComponent', () => {
        it('should add a component to the custom element registry', () => {
            class C extends HTMLElement{}
            defineComponent('tag-name', C, 'namespace');
            expect(customElements.get('namespace-tag-name')).toBeDefined();
        });
    });

    describe('findInSlot', () => {
        it('should find the first element in a slot given a selector', () => {
            makeCustomElement();
            document.body.appendChild(htmlStringToElement('<custom-element><div id="slotted"></div></custom-element>'));

            expect(findInSlot(document.querySelector('custom-element'), '#slotted')).toBeDefined();
        });
    });
});

const makeCustomElement = () => {
        const template = document.createElement('template');
        template.innerHTML = `
            <slot></slot>
        `;

        class CustomElement extends HTMLElement {
            constructor() {
                super();

                this.attachShadow({ mode: 'open' });
                this.shadowRoot.appendChild(template.content.cloneNode(true));
            }
        }

        customElements.define('custom-element', CustomElement);
};