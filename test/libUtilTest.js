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
    getLastNCharacters,
    getIfHeadError,
    getIfTailError,
    isNotNatural,
    doesAttachOption,
    doesNeedHeaders,
    doesContainC,
    isCountInvalid,
    sliceFrom
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
    it("should work for single text and header for when file text not eligible", function () {
        const isEligible = () => false;
        deepEqual(insertHeaders(["text1"], ["header1"], isEligible), ['text1']);
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

describe('getIfHeadError', function () {
    it('should return illegal line count 0 error', function () {
        deepEqual(getIfHeadError({ count: 0, action: getNHeadLines, filesName: ["abc"] }), 'head: illegal line count -- 0');
    });
    it("should return byte count option", function () {
        deepEqual(getIfHeadError({ action: getNHeadLines, count: '', filesName: ["abc"] }), "head: illegal line count -- ");
    });
    it("should return byte count option with invalid count", function () {
        deepEqual(getIfHeadError({ action: getFirstNCharacters, count: 't', filesName: ["abc"] }), "head: illegal byte count -- t");
    });
    it("should return line count option with fileName", function () {
        deepEqual(getIfHeadError({ action: getFirstNCharacters, count: 'error', filesName: ["abc"] }), "head: illegal byte count -- abc");
    });
});

describe('getIfTailError', function () {
    it('should return an error for invalid values for -n', function () {
        deepEqual(getIfTailError({ count: '3t', action: getNTailLines, filesName: ['abc'] }), 'tail: illegal offset -- 3t');
    });
    it('should return an error with file name for count error', function () {
        deepEqual(getIfTailError({ count: 'error', action: getLastNCharacters, filesName: ['abc'] }), 'tail: illegal offset -- abc');
    });

});

describe('isNotNatural', function () {
    it('should return true for Natural number', function () {
        deepEqual(isNotNatural(1), false);
    });
    it('should return false for non-natural number', function () {
        deepEqual(isNotNatural(0), true);
    });
});

describe('doesContainC', function () {
    it('should return true when list contains -c', function () {
        deepEqual(doesContainC(['-c', 'd', 'e']), true);
    });
    it('should return false when list does not contain -c', function () {
        deepEqual(doesContainC(['t', 'd', 'e']), false);
    });
});

describe('doesAttachOption', function () {
    it('should return true if option is attached', function () {
        deepEqual(doesAttachOption('-c4'), true);
    });
    it('should return false if option is not attached', function () {
        deepEqual(doesAttachOption('-c'), false);
    });
});

describe('doesNeedHeaders', function () {
    it('should return true if no of files is more than 1', function () {
        deepEqual(doesNeedHeaders(['abc', 'def']), true);
    });
    it('should return false if no of files is 1', function () {
        deepEqual(doesNeedHeaders(['abc']), false);
    });
    it('should return false if no file is there', function () {
        deepEqual(doesNeedHeaders([]), false);
    });
});

describe('isCountInvalid', function () {
    it('should return true if count is invalid', function () {
        deepEqual(isCountInvalid(['node', 'head.js', '-c', 't']), true);
    });
    it('should return false if count is valid', function () {
        deepEqual(isCountInvalid(['node', 'head.js', '-c', '4']), false);
    });
});

describe('sliceFrom', function () {
    it('should return as it is if start is zero', function () {
        deepEqual(sliceFrom(['abc', 'def'], 0), ['abc', 'def']);
    });
    it('should work for any natural value of start', function () {
        deepEqual(sliceFrom(['abc', 'def'], 1), ['def']);
    });
    it('should work for length of the content', function () {
        deepEqual(sliceFrom(['abc', 'def'], 2), []);
    });
});