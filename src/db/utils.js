import { isPlainObject } from './typeCheck';

/**
 * snake case 문자열을 camel case 문자열로 치환합니다.
 * @param {String} snakeCase
 * @returns
 */
const sToC = (snakeCase) => {
    let underscore = false;
    return [...snakeCase].reduce((acc, curr) => {
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
};

/**
 * camel case 문자열을 snake case 문자열로 치환합니다
 * @param {*} camelKey
 * @returns
 */
const cToS = (camelKey) => {
    return [...camelKey].reduce((acc, curr) => {
        if (curr === curr.toUpperCase()) {
            return acc + '_' + curr.toLowerCase();
        }
        return acc + curr;
    }, '');
};

/**
 * 오브젝트 내의 모든 키를 snake-case에서 camel-case로 변경한 오브젝트를 반환합니다
 * 문자열을 전달시 문자열만 치환해서 전달됩니다
 * @param {*} obj
 * @returns
 */
export const snakeToCamel = (obj) => {
    if (typeof obj === 'string') return sToC(obj);
    const newObj = {};
    const snakeKeys = Object.keys(obj);

    for (const snakeKey of snakeKeys) {
        const camelKey = sToC(snakeKey);

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
 * * 문자열을 전달시 문자열만 치환해서 전달됩니다
 * @param {*} obj
 */
export const camelToSnake = (obj) => {
    if (typeof obj === 'string') return cToS(obj);
    const camelKeys = Object.keys(obj);

    const newObj = {};
    for (const camelKey of camelKeys) {
        const snakeKey = cToS(camelKey);

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

/**
 * 오브젝트를 업데이트 가능한 column만 전달하는 쿼리 문자열로 변환합니다.
 * @param {object} obj
 * @returns
 */
export const updateSetQuery = (obj) => {
    const queries = [];
    for (const key of Object.keys(obj)) {
        if (obj[key] === undefined) continue;
        queries.push(`${camelToSnake(key)}='${obj[key]}'`);
    }

    // 변환할 대상이 없다면 id만 동일 id로 변경하는 쿼리전달
    if (!queries.length) return 'id=id';
    return queries.join(',');
};
