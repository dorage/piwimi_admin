import { isPlainObject } from './typeCheck';

/**
 * 오브젝트 내의 모든 키를 snake-case에서 camel-case로 변경한 오브젝트를 반환합니다
 * @param {*} obj
 * @returns
 */
export const snakeToCamel = (obj) => {
    const newObj = {};
    const snakeKeys = Object.keys(obj);

    for (const snakeKey of snakeKeys) {
        let underscore = false;
        const camelKey = [...snakeKey].reduce((acc, curr) => {
            if (curr === '_') {
                underscore = true;
                return acc;
            }
            if (underscore) {
                underscore = false;
                return acc + curr.toUpperCase();
            }
            return acc + curr;
        }, '');

        if (isPlainObject(obj[snakeKey])) {
            newObj[camelKey] = snakeToCamel(obj[snakeKey]);
            continue;
        }
        newObj[camelKey] = obj[snakeKey];
    }

    return newObj;
};

/**
 * 오브젝트 내의 모든 키를 camel-case에서 snake-case로 변경한 오브젝트를 반환합니다
 * @param {*} obj
 */
export const camelToSnake = (obj) => {
    const camelKeys = Object.keys(obj);

    const newObj = {};
    for (const camelKey of camelKeys) {
        const snakeKey = [...camelKey].reduce((acc, curr) => {
            if (curr === curr.toUpperCase()) {
                return acc + '_' + curr;
            }
            return acc + curr;
        }, '');

        if (isPlainObject(obj[camelKey])) {
            newObj[snakeKey] = camelToSnake(obj[camelKey]);
            continue;
        }
        newObj[snakeKey] = obj[camelKey];
    }

    return newObj;
};

const copyObj = (obj) => {
    const newObj = {};
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object') copyObj(obj[key]);
        else newObj[key] = obj[key];
    }
    return newObj;
};
