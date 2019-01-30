import {extendSelector, getExtendable} from "./selectors";

describe('Selectors', () => {
    describe('construct', () => {
        it('should create an extendable selector', () => {

            const state = {
                key: 'val'
            };

            const getSomething =(state) => {
                return state.key
            };

            const extendedGetSomething = extendSelector(
                getSomething,
                (val) => {
                    return val + ' extended'
                }
            );

            console.log(extendedGetSomething)

            // const anotherExtendedGetSomething = extendSelector(
            //     getSomething,
            //     (val) => {
            //         return val + ' more'
            //     }
            // );

            expect(getExtendable(state, getSomething)).toBe('val extended more');
        });

        it('should create multiple extendable selectors', () => {

            const state = {
                key: 'val',
                key2: 'val'
            };

            const getSomething =(state) => {
                return state.key
            };

            const getSomething2 =(state) => {
                return state.key2
            };

            const extendedGetSomething = extendSelector(
                getSomething,
                (val) => {
                    return val + ' extended'
                }
            );

            const extendedGetSomething2 = extendSelector(
                getSomething2,
                (val) => {
                    return val + ' extended2'
                }
            );

            const extendedGetSomething2More = extendSelector(
                getSomething2,
                (val) => {
                    return val + ' more'
                }
            );


            expect(getExtendable(state, getSomething)).toBe('val extended');
            expect(getExtendable(state, getSomething2)).toBe('val extended2 more');
        });
    });
});


