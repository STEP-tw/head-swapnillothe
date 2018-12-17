const assert = require('assert');

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
    isNotNatural,
    doesAttachOption,
    doesNeedHeaders,
    doesContainC,
    isCountInvalid,
    sliceFrom,
    extractCommand,
    isNotZero,
    recorrectCount
} = require('../src/libUtil');

describe("identity", function () {
    it("should return same as given", function () {
        assert.deepEqual(identity("x"), "x");
    });
});

describe("removeCharacters", function () {
    it("should work", function () {
        assert.deepEqual(removeCharacter("abcdefghi", "a"), "bcdefghi");
    });
});

describe("formatText", function () {
    it("should format text like this ==> text <==\n\n", function () {
        assert.deepEqual(formatText("abcd"), "==> abcd <==");
    });
});

describe("insertHeaders", function () {
    it("should work for single text and header", function () {
        assert.deepEqual(insertHeaders(["text1"], ["header1"]), ['==> header1 <==\ntext1']);
    });
    it("should work for multiple texts and headers", function () {
        assert.deepEqual(insertHeaders(["text1", "text2"], ["header1", "header2"]), ['==> header1 <==\ntext1', '==> header2 <==\ntext2']);
    });
    it("should work for single text and header for when file text not eligible", function () {
        const isEligible = () => false;
        assert.deepEqual(insertHeaders(["text1"], ["header1"], isEligible), ['text1']);
    });
});

describe("getFirstNCharacters", function () {
    it("should work for single line", function () {
        assert.deepEqual(getFirstNCharacters(2, "abc"), "ab");
    });
    it("should work for multiple lines", function () {
        assert.deepEqual(getFirstNCharacters(5, "abc\nabc"), "abc\na");
    });
    it("should return empty string for zero character requirement", function () {
        assert.deepEqual(getFirstNCharacters(0, "abc"), "");
    });
});

describe("getNHeadLines", function () {
    it("should work for no line", function () {
        assert.deepEqual(getNHeadLines(0, ''), '');
    });
    it("should work for single line", function () {
        assert.deepEqual(getNHeadLines(1, 'a'), 'a');
    });
    it("should work for multiple lines", function () {
        assert.deepEqual(getNHeadLines(2, 'a\nb\nc'), 'a\nb');
    });
    it("should work for less no of lines with more requirment of no of lines", function () {
        assert.deepEqual(getNHeadLines(5, 'a\nb\nc'), 'a\nb\nc');
    });
});

describe('applyActionIfExists', function () {
    const add = (x, y) => (x + y);
    it('should work if object is present', function () {
        assert.deepEqual(applyActionIfExist(add, 5, [1, 2], ['one', 'two'], identity), [6, 7]);
    });
    it('should return as it is', function () {
        assert.deepEqual(applyActionIfExist(add, 5, [1, 2]), [1, 2]);
    })
});

describe('getNTailLines', function () {
    it('should work for no text', function () {
        assert.deepEqual(getNTailLines(2, ''), '');
    });
    it("should work for single line", function () {
        assert.deepEqual(getNTailLines(1, 'a'), 'a');
    });
    it("should work for multiple lines", function () {
        assert.deepEqual(getNTailLines(2, 'a\nb\nc'), 'b\nc');
    });
    it("should work for less no of lines with more requirment of no of lines", function () {
        assert.deepEqual(getNTailLines(5, 'a\nb\nc'), 'a\nb\nc');
    });
});

describe('getLastNCharacters', function () {
    it('should works for single line', function () {
        assert.deepEqual(getLastNCharacters(2, 'abc'), 'bc');
    });
    it('should works for multiple lines', function () {
        assert.deepEqual(getLastNCharacters(2, 'abc\ndef'), 'ef');
    });
});

describe('isNotNatural', function () {
    it('should return true for Natural number', function () {
        assert.deepEqual(isNotNatural(1), false);
    });
    it('should return false for non-natural number', function () {
        assert.deepEqual(isNotNatural(0), true);
    });
});

describe('doesContainC', function () {
    it('should return true when list contains -c', function () {
        assert.deepEqual(doesContainC(['-c', 'd', 'e']), true);
    });
    it('should return false when list does not contain -c', function () {
        assert.deepEqual(doesContainC(['t', 'd', 'e']), false);
    });
});

describe('doesAttachOption', function () {
    it('should return true if option is attached', function () {
        assert.deepEqual(doesAttachOption('-c4'), true);
    });
    it('should return false if option is not attached', function () {
        assert.deepEqual(doesAttachOption('-c'), false);
    });
});

describe('doesNeedHeaders', function () {
    it('should return true if no of files is more than 1', function () {
        assert.deepEqual(doesNeedHeaders(['abc', 'def']), true);
    });
    it('should return false if no of files is 1', function () {
        assert.deepEqual(doesNeedHeaders(['abc']), false);
    });
    it('should return false if no file is there', function () {
        assert.deepEqual(doesNeedHeaders([]), false);
    });
});

describe('isCountInvalid', function () {
    it('should return true if count is invalid', function () {
        assert.deepEqual(isCountInvalid(['node', 'head.js', '-c', 't']), true);
    });
    it('should return false if count is valid', function () {
        assert.deepEqual(isCountInvalid(['node', 'head.js', '-c', '4']), false);
    });
});

describe('sliceFrom', function () {
    it('should return as it is if start is zero', function () {
        assert.deepEqual(sliceFrom(['abc', 'def'], 0), ['abc', 'def']);
    });
    it('should work for any natural value of start', function () {
        assert.deepEqual(sliceFrom(['abc', 'def'], 1), ['def']);
    });
    it('should work for length of the content', function () {
        assert.deepEqual(sliceFrom(['abc', 'def'], 2), []);
    });
});

describe('extractCommmand', function () {
    it('should extract command from given list of content', function () {
        assert.deepEqual(extractCommand('~/lswapnil/project/head/src/tail.js'), 'tail');
    });
});

describe('isNotZero', function () {
    it('should return true for non-zero value', function () {
        assert.deepEqual(isNotZero(1), true);
    });
    it('should return false for zero', function () {
        assert.deepEqual(isNotZero(0), false);
    });
});

describe('recorrectCount', function () {
    it('should return 10 if count and third arg is NaN', function () {
        let actualOutPut = recorrectCount(['node', 'head.js', 'file1','file2'], 'a1');
        assert.deepEqual(actualOutPut, 10);
    });
    it('should return count if count is of number type', function () {
        let actualOutPut = recorrectCount(['node', 'head.js', 'file1','file2'], '1');
        assert.deepEqual(actualOutPut, 1);
    });
    it('should return count if count is of number type', function () {
        let actualOutPut = recorrectCount(['node', 'head.js', 'file1','12'], 'a1');
        assert.deepEqual(actualOutPut, 12);
    });
});