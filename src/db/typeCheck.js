/**
 * 함수인지 체크합니다.
 * @param {*} obj
 * @returns
 */
const isFunction = (obj) => {
    if (Object.prototype.toString.call(obj) === '[object Function]')
        return true;
    return false;
};

/**
 * Array와 length 키를 통해 Array-like 객체인지 확인합니다
 * @param {*} obj
 * @returns
 */
const isArray = (obj) => {
    if (Object.keys(obj).includes('length')) return true;
    if (Object.prototype.toString.call(obj) === '[object Array]') return true;
    return false;
};

/**
 * 함수를 포함하지 않은 object인지 체크합니다
 * @param {*} obj
 * @returns
 */
const isPlainObject = (obj) => {
    for (const key of Object.keys(obj)) {
        if (isFunction(obj[key])) return false;
    }
    if (Object.prototype.toString.call(obj) !== '[object Object]') return false;
    return true;
};
