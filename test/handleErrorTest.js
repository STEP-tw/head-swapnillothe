const assert = require('assert');
const {
    getIfHeadError,
    getIfTailError
} = require('../src/handleError');

const {
    getNHeadLines,
    getNTailLines,
    getFirstNCharacters,
    getLastNCharacters
} = require('../src/libUtil');

describe('getIfHeadError', function () {
    it('should return illegal line count 0 for count 0', function () {
        let actualOutput = getIfHeadError({
            count: 0,
            action: getNHeadLines,
            filesName: ['fileName']
        });
        let expectedOutput = 'head: illegal line count -- 0';
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return byte count option for no count', function () {
        let actualOutput = getIfHeadError({
            count: '',
            action: getNHeadLines,
            filesName: ['fileName']
        });
        let expectedOutput = 'head: illegal line count -- ';
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return byte count option with invalid count NaN', function () {
        let actualOutput = getIfHeadError({
            count: 't',
            action: getFirstNCharacters,
            filesName: ['fileName']
        });
        let expectedOutput = 'head: illegal byte count -- t';
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return line count option with fileName if count is error', function () {
        let actualOutput = getIfHeadError({
            count: 'error',
            action: getFirstNCharacters,
            filesName: ['fileName']
        });
        let expectedOutput = 'head: illegal byte count -- fileName';
        assert.deepEqual(actualOutput, expectedOutput);
    });
});

describe('getIfTailError', function () {
    it('should return an std error for invalid values for count', function () {
        let actualOutput = getIfTailError({
            count: '3t',
            action: getNTailLines,
            filesName: ['fileName']
        });
        let expectedOutput = 'tail: illegal offset -- 3t';
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return an error with file name for count error', function () {
        let actualOutput = getIfTailError({
            count: 'error',
            action: getLastNCharacters,
            filesName: ['fileName']
        });
        let expectedOutput = 'tail: illegal offset -- fileName';
        assert.deepEqual(actualOutput, expectedOutput);
    });
    it('should return an error for count error', function () {
        let actualOutput = getIfTailError({
            count: '-1',
            action: getNTailLines,
            filesName: ['fileName']
        });
        let expectedOutput = 'tail: illegal offset -- -1';
        assert.deepEqual(actualOutput, expectedOutput);
    });
});