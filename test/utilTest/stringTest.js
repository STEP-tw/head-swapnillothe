const {
    removeCharacter,
    sliceFrom
} = require('../../src/util/string.js');

const assert = require('assert');

describe("removeCharacters", function () {

    it("should remove characters from the given text", function () {
        let actualOutPut = removeCharacter("abcdefghi", "a");
        assert.deepEqual(actualOutPut, "bcdefghi");
    });
});

describe('sliceFrom', function () {

    it('should return as it is if start is zero', function () {
        let actualOutPut = sliceFrom(['firstElement', 'secondElement'], 0);
        let expectedOutput = ['firstElement', 'secondElement'];
        assert.deepEqual(actualOutPut, expectedOutput);
    });

    it('should work for any natural value of start', function () {
        let actualOutPut = sliceFrom(['firstElement', 'secondElement'], 1);
        let expectedOutput = ['secondElement'];
        assert.deepEqual(actualOutPut, expectedOutput);
    });

    it('should work for length of the content', function () {
        let actualOutPut = sliceFrom(['firstElement', 'secondElement'], 2);
        let expectedOutput = [];
        assert.deepEqual(actualOutPut, expectedOutput);
    });
});