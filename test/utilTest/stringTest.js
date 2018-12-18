const {
    removeCharacter
} = require('../../src/util/string.js');

const assert = require('assert');

describe("removeCharacters", function () {

    it("should remove characters from the given text", function () {
        let actualOutPut = removeCharacter("abcdefghi", "a");
        assert.deepEqual(actualOutPut, "bcdefghi");
    });
});