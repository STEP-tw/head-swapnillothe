const { deepEqual } = require('assert');

const {
    identity,
    formatText,
    removeCharacter,
    getFirstNCharacters,
    getNHeadLines,
    insertHeaders,
    applyActionIfExist,
    getNTailLines,
    getLastNCharacters
} = require('../src/libUtil');

describe("identity", function () {
    it("should return same as given", function () {
        deepEqual(identity("x"), "x");
    });
});

describe("removeCharacters", function () {
    it("should work", function () {
        deepEqual(removeCharacter("abcdefghi", "a"), "bcdefghi");
        deepEqual(removeCharacter("abcd\nefghi", "b"), "acd\nefghi");
    });
});

describe("formatText", function () {
    it("should format text like this ==> text <==\n\n", function () {
        deepEqual(formatText("abcd"), "==> abcd <==");
    });
});

describe("insertHeaders", function () {
    it("should work for single text and header", function () {
        deepEqual(insertHeaders(["text1"], ["header1"]), ['==> header1 <==\ntext1']);
    });
    it("should work for multiple texts and headers", function () {
        deepEqual(insertHeaders(["text1", "text2"], ["header1", "header2"]), ['==> header1 <==\ntext1', '==> header2 <==\ntext2']);
    });
});

describe("getFirstNCharacters", function () {
    it("should work for single line", function () {
        deepEqual(getFirstNCharacters(2, "abc"), "ab");
    });
    it("should work for multiple lines", function () {
        deepEqual(getFirstNCharacters(2, "abc\nabc"), "ab");
        deepEqual(getFirstNCharacters(5, "abc\nabc"), "abc\na");
    });
    it("should return empty string for zero character requirement", function () {
        deepEqual(getFirstNCharacters(0, "abc"), "");
    });
});

describe("getNHeadLines", function () {
    it("should work for no line", function () {
        deepEqual(getNHeadLines(0, ''), '');
    });
    it("should work for single line", function () {
        deepEqual(getNHeadLines(1, 'a'), 'a');
    });
    it("should work for multiple lines", function () {
        deepEqual(getNHeadLines(2, 'a\nb\nc'), 'a\nb');
    });
    it("should work for less no of lines with more requirment of no of lines", function () {
        deepEqual(getNHeadLines(5, 'a\nb\nc'), 'a\nb\nc');
    });
});

describe('applyActionIfExists', function () {
    const add5 = (x, y) => (x + y);
    it('should work if object is present', function () {
        deepEqual(applyActionIfExist(add5, 5, [1, 2], ['one', 'two'], identity), [6, 7]);
    });
    it('should return as it is', function () {
        deepEqual(applyActionIfExist(add5, 5, [1, 2]), [1, 2]);
    })
});

describe('getNTailLines', function () {
    it('should work for no text', function () {
        deepEqual(getNTailLines(2, ''), '');
    });
    it("should work for single line", function () {
        deepEqual(getNTailLines(1, 'a'), 'a');
    });
    it("should work for multiple lines", function () {
        deepEqual(getNTailLines(2, 'a\nb\nc'), 'b\nc');
    });
    it("should work for less no of lines with more requirment of no of lines", function () {
        deepEqual(getNTailLines(5, 'a\nb\nc'), 'a\nb\nc');
    });
});

describe('getLastNCharacters', function () {
    it('should works for single line', function () {
        deepEqual(getLastNCharacters(2, 'abc'), 'bc');
    });
    it('should works for multiple lines', function () {
        deepEqual(getLastNCharacters(2, 'abc\ndef'), 'ef');
    });
});