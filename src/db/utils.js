import { isPlainObject } from './typeCheck';

/**
 * 오브젝트 내의 모든 키를 snake-case에서 camel-case로 변경한 오브젝트를 반환합니다
 * @param {*} obj
 * @returns
 */
export const snakeToCamel = (obj) => {
    const newObj = {};
    const keys = Object.keys(obj);

    for (const snakeKey of keys) {
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

        if (isPlainObject(obj)) {
            newObj[camelKey] = snakeToCamel(obj[snakeKey]);
        }
        return (newObj[camelKey] = obj[snakeKey]);
    }

    return newObj;
};

/**
 * 오브젝트 내의 모든 키를 camel-case에서 snake-case로 변경한 오브젝트를 반환합니다
 * @param {*} obj
 */
export const camelToSnake = (obj) => {
    const keys = Object.keys(obj);

    const newObj = {};
    keys.forEach((snakeKey) => {
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
        });
        newObj[camelKey] = obj[snakeKey];
    });

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

/**
 * 변경된 OG를 적용해서 OG를 새로 구성합니다
 * @param {*} oldOG
 * @param {*} newOG
 * @returns
 */
export const updateOpengraph = (oldOG, newOG) => {
    const obj = {};
    for (const key of Object.keys(oldOG)) {
        if (newOG[key] === undefined) {
            obj[key] = oldOG[key];
            continue;
        }
        if (oldOG[key] instanceof Object) {
            obj[key] = updateOpengraph(oldOG[key], newOG[key]);
            continue;
        }
        obj[key] = newOG[key];
    }
    return obj;
};
