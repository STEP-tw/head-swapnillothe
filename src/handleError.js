const {
    getNHeadLines,
    getFirstNCharacters,
} = require('../src/util/libUtil');

const {
    isNatural
} = require('./util/numbers.js')

const getIfHeadError = function ({ count, action }) {
    if (headLineCountError(count, action)) {
        return lineCountError(count);
    }
    if (headCharCountError(count, action)) {
        return byteCountError(count);
    }
    return '';
}

const getIfTailError = function ({ count }) {
    if (illegalCount(count)) {
        return createTailCountError(count);
    }
    return '';
}

const headLineCountError = function (count, action) {
    return (!isNatural(count)) && action == getNHeadLines;
}

const headCharCountError = function (count, action) {
    return isNaN(count) && action == getFirstNCharacters;
}

const illegalCount = function (count) {
    return (count < 0) || isNaN(count);
}

const createTailCountError = function (count) {
    return `tail: illegal offset -- ${count}`;
}

const createHeadCountError = function (lineOrByte, count) {
    return `head: illegal ${lineOrByte} count -- ${count}`
}

const lineCountError = createHeadCountError.bind(null, 'line');
const byteCountError = createHeadCountError.bind(null, 'byte');

module.exports = {
    getIfHeadError,
    getIfTailError
}