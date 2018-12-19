const assert = require('assert');

const {
    identity,
    formatText,
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
    extractCommand,
    recorrectCount
} = require('../../src/util/libUtil.js');

describe("identity", function () {
    it("should return same as given", function () {
        assert.deepEqual(identity("x"), "x");
    });
});

describe("formatText", function () {
    it("should format text like this ==> text <==\n\n", function () {
        assert.deepEqual(formatText("abcd"), "==> abcd <==");
    });
});

describe("insertHeaders", function () {

    it("should insertHeaders for single text and header", function () {
        let actualOutPut = insertHeaders(["text1"], ["header1"]);
        let expectedOutput = ['==> header1 <==\ntext1'];
        assert.deepEqual(actualOutPut, expectedOutput);
    });

    it("should insertHeaders for multiple texts and headers", function () {
        let actualOutPut = insertHeaders(
            ["text1", "text2"],
            ["header1", "header2"]
        );
        let expectedOutput = [
            '==> header1 <==\ntext1',
            '==> header2 <==\ntext2'
        ];
        assert.deepEqual(actualOutPut, expectedOutput);
    });

    it("should insertHeaders for single text and header for when file text not eligible", function () {
        const isEligible = () => false;
        let actualOutPut = insertHeaders(["text1"], ["header1"], isEligible);
        assert.deepEqual(actualOutPut, ['text1']);
    });
});

describe("getFirstNCharacters", function () {

    it("should get first required n charcters for single line", function () {
        assert.deepEqual(getFirstNCharacters(2, "abc"), "ab");
    });

    it("should get first required n charcters for multiple lines", function () {
        assert.deepEqual(getFirstNCharacters(5, "abc\nabc"), "abc\na");
    });

    it("should return empty string for zero character requirement", function () {
        assert.deepEqual(getFirstNCharacters(0, "abc"), "");
    });
});

describe("getNHeadLines", function () {

    it("should return empty string for empty file", function () {
        assert.deepEqual(getNHeadLines(0, ''), '');
    });

    it("should return required first n required lines for non-empty file", function () {
        assert.deepEqual(getNHeadLines(2, 'a\nb\nc'), 'a\nb');
    });

    it("should return at least whole file with more requirment of no of lines", function () {
        assert.deepEqual(getNHeadLines(5, 'a\nb\nc'), 'a\nb\nc');
    });
});

describe('applyActionIfExists', function () {
    const add = (number1, number2) => (number1 + number2);
    let action = add;
    let actionArgs = [1, 2];
    let content = ['one', 'two'];
    let expected = [6, 7];

    it('should work if object is present', function () {
        let actualOutPut = applyActionIfExist(action, 5, actionArgs, content, identity);
        assert.deepEqual(actualOutPut, expected);
    });

    it('should return as it is if content is not present', function () {
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

describe('extractCommmand', function () {

    it('should extract command from given list of content', function () {
        let path = '~/lswapnil/project/head/src/tail.js';
        assert.deepEqual(extractCommand(path), 'tail');
    });
});

describe('recorrectCount', function () {

    it('should return 10 if count and third arg is NaN', function () {
        let arg1 = ['node', 'head.js', 'file1', 'file2'];
        let actualOutPut = recorrectCount(arg1, 'a1');
        assert.deepEqual(actualOutPut, 10);
    });

    it('should return count if count is of number type', function () {
        let arg1 = ['node', 'head.js', 'file1', 'file2'];
        let actualOutPut = recorrectCount(arg1, '1');
        assert.deepEqual(actualOutPut, 1);
    });

    it('should return count if count is of number type', function () {
        let arg1 = ['node', 'head.js', 'file1', '12'];
        let actualOutPut = recorrectCount(arg1, 'a1');
        assert.deepEqual(actualOutPut, 12);
    });
});