import { isArray, isFunction, isPlainObject } from '../src/db/typeCheck';
import { camelToSnake, snakeToCamel } from '../src/db/utils';

const typeCheck = (value) => {
    console.log('isPlainObject', isPlainObject('abc'));
    console.log('isFunction', isFunction('abc'));
    console.log('isArray', isArray('abc'));
};

const main = async () => {
    try {
        const snake = {
            a_b: '123',
            b_c: '456',
            d_e: 'asdf',
            e_f: {
                h_i: '1234',
            },
        };
        const camel = snakeToCamel(snake);
        console.log('snake-camel', camel);
        console.log('camel-snake', camelToSnake(camel));
    } catch (err) {
        console.log(err);
    }
};

export default main;
