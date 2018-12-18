const {
    getNHeadLines,
    getNTailLines,
    getFirstNCharacters,
    getLastNCharacters,
    isNotZero
} = require('../src/libUtil');

const headLineCountError = function (count, action) {
    return (count < 1 || isNaN(count)) && action == getNHeadLines;
}

const headByteError = function (count, action) {
    return count == "error" && action == getFirstNCharacters;
}

const headCharCountError = function (count, action) {
    return isNaN(count) && action == getFirstNCharacters;
}

const illegalCount = function (count, action) {
    return (count < 1 && action == getNTailLines
        && isNotZero(count)) || isNaN(count);
}

const getIfHeadError = function ({ count, action, filesName }) {

    const headErrors = {
        'lineCountError': `head: illegal line count -- ${count}`,
        'byteCountError': `head: illegal byte count -- ${count}`,
        'errorWithFileName': `head: illegal byte count -- ${filesName[0]}`
    };

    if (headLineCountError(count, action)) {
        return headErrors['lineCountError'];
    }
    if (headByteError(count, action)) {
        return headErrors['errorWithFileName'];
    }
    if (headCharCountError(count, action)) {
        return headErrors['byteCountError']
    }
    return '';
}

const getIfTailError = function ({ count, action, filesName }) {
    const tailErrors = {
        'errorWithFileName': `tail: illegal offset -- ${filesName[0]}`,
        'illegalCount': `tail: illegal offset -- ${count}`
    };

    if (count == "error" && action == getLastNCharacters) {
        return tailErrors['errorWithFileName'];
    }
    if (illegalCount(count, action)) {
        return tailErrors['illegalCount'];
    }
    return '';
}

module.exports = {
    getIfHeadError,
    getIfTailError
}