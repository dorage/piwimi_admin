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
        console.log('snake-camel [OBJECT]', camel);
        console.log('camel-snake [OBJECT]', camelToSnake(camel));
        console.log('snake-camel [STRING]', snakeToCamel('hello_world!'));
        console.log('camel-snake [STRING]', camelToSnake('helloWorld!'));

        const updateSetQuery = (json) => {
            const queries = [];
            for (const key of Object.keys(json)) {
                if (json[key] === undefined) continue;
                queries.push(`${camelToSnake(key)}=${json[key]}`);
            }
            return queries.join(',');
        };
        console.log(
            updateSetQuery({
                isOpend: 'asdfjalk',
                helloWolrd: 'asdfasd',
            }),
        );
    } catch (err) {
        console.log(err);
    }
};

export default main;
