const {
    getNHeadLines,
    getNTailLines,
    getFirstNCharacters,
    isNotZero
} = require('../src/util/libUtil');

const headLineCountError = function (count, action) {
    return (count < 1 || isNaN(count)) && action == getNHeadLines;
}

const headCharCountError = function (count, action) {
    return isNaN(count) && action == getFirstNCharacters;
}

const illegalCount = function (count, action) {
    return (count < 1 && action == getNTailLines
        && isNotZero(count)) || isNaN(count);
}

const getIfHeadError = function ({ count, action, filesName }) {
    let lineCountError = `head: illegal line count -- ${count}`
    let byteCountError = `head: illegal byte count -- ${count}`

    if (headLineCountError(count, action)) {
        return lineCountError;
    }
    if (headCharCountError(count, action)) {
        return byteCountError;
    }
    return '';
}

const getIfTailError = function ({ count, action }) {
    let illegalCountError = `tail: illegal offset -- ${count}`
    if (illegalCount(count, action)) {
        return illegalCountError;
    }
    return '';
}

module.exports = {
    getIfHeadError,
    getIfTailError
}