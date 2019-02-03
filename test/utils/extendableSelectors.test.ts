import {createSelector} from "../../src/utils/reselect";
import {createExtendableSelector, extendSelector} from "../../src/utils/extendableSelectors";

describe('Selectors', () => {
    let state = {data: {key1: 'val1'}, foo: 'bar'};
    const getData = (state) => {
        return state.data
    };

    const getFoo = () => {
        return state.foo;
    };

    it('should create an extendable a selector', () => {
        const getExtendableData = createExtendableSelector('data',
            (state) => {
                return state.data
            }
        );

        expect(getExtendableData(state)).toEqual(state.data);
    });

    it('should create an extendable memoized selector', () => {
        const getActiveData = createExtendableSelector('mActiveData',
            createSelector(
                getData,
                (data) => {
                    return data;
                }
            ));

        expect(getActiveData(state)).toEqual(state.data);
    });


    it('should extend a selector', () => {
        const getActiveData = createExtendableSelector('eActiveData',
            createSelector(
                getData,
                (data) => {
                    return data;
                }
            ));

        const getAppendedData = extendSelector('eActiveData',
            (data) => {
                return  {...data, key2: 'val2'}
            }
        );

        expect(getActiveData(state)).toEqual({key1: 'val1', key2: 'val2'});
        expect(getAppendedData(state)).toEqual({key1: 'val1', key2: 'val2'});
    });

    it('should extend a selector with other state selector params', () => {

        const getActiveData = createExtendableSelector('sActiveData',
            createSelector(
                getData,
                (data) => {
                    return data;
                }
            ));

        extendSelector(
            'sActiveData',
            getFoo,
            (data, foo) => {
                return  {...data, foo}
            }
        );

        expect(getActiveData(state)).toEqual({key1: 'val1', foo: 'bar'});
    });


    it('should use an extended selector in memoization', () => {
        const getData = (state) => {
            return state.data
        };

        const getActiveData = createExtendableSelector('smActiveData',
            createSelector(
                getData,
                (data) => {
                    return data;
                }
            ));

        extendSelector('smActiveData',
            (data) => {
                return  {...data, key2: 'val2'}
            }
        );

        const getKey2 = createSelector(
            getActiveData,
            (activeData) => {
                return activeData.key2
            }
        );

        expect(getKey2(state)).toEqual('val2');
    });
});



