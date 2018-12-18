const assert = require('assert');
const {
  head,
  tail,
  extractFileContents,
  organizeInputs,
  readFile,
  readUserInputs,
  extractAction
} = require('../src/lib.js');

const {
  getFirstNCharacters,
  getNHeadLines,
  getNTailLines,
  getLastNCharacters,
  identity
} = require('../src/libUtil.js');


describe("head", function () {

  it("should return single line of file for count 1 and single file", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ["abc"],
      count: 1,
      filesName: ["abc"]
    });
    assert.deepEqual(actualOutput, "abc");
  });

  it("should return file contents with their headers for multiple files", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ['1\n2\n3\n4\n5', 'a\nb\nc\nd'],
      count: 1,
      filesName: ['numbers.txt', 'alphabets.txt']
    });
    let expectedOutput = '==> numbers.txt <==\n1\n2\n3\n4\n5\n';
    expectedOutput += '==> alphabets.txt <==\na\nb\nc\nd';
    assert.deepEqual(actualOutput, expectedOutput);
  })

  it("should return error: 0 as an illegal line count", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ['1\n2\n3\n4\n5', 'a\nb\nc\nd'],
      count: 0,
      filesName: ['numbers.txt', 'alphabets.txt']
    });
    let expectedOutput = 'head: illegal line count -- 0';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should list all contents if count is greater than number of lines", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ['1\n2\n3\n4\n5'],
      count: 6,
      filesName: ['numbers.txt']
    });
    let expectedOutput = '1\n2\n3\n4\n5';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return byte count error if count is nothing", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ['1\n2\n3\n4\n5'],
      count: '',
      filesName: ['numbers.txt']
    });
    let expectedOutput = 'head: illegal line count -- ';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return byte count error for invalid count", function () {
    let actualOutput = head({
      action: getFirstNCharacters,
      files: ['1\n2\n3\n4\n5'],
      count: 't',
      filesName: ['numbers.txt']
    });
    let expectedOutput = 'head: illegal byte count -- t';
    assert.deepEqual(actualOutput, expectedOutput);
  });
  it("should return line count error with fileName if count is error", function () {
    let actualOutput = head({
      action: getFirstNCharacters,
      files: ['1\n2\n3\n4\n5'],
      count: 'error',
      filesName: ['numbers.txt']
    });
    let expectedOutput = 'head: illegal byte count -- numbers.txt';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("tail", function () {
  const doesFileExist = () => true;
  it("should tail for single file", function () {
    let actualOutput = tail({
      action: getNTailLines,
      files: ['1\n2\n3\n4'],
      count: 1,
      filesName: ['numbers.txt'],
      fileExistenceChecker: doesFileExist
    });
    let expectedOutput = '4';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should tail for multiple files and more than one count", function () {
    let actualOutput = tail({
      action: getNTailLines,
      files: ['1\n2\n3\n4', 'a\nb\nc\nd'],
      count: 2,
      filesName: ['numbers.txt', 'alphabets.txt'],
      fileExistenceChecker: doesFileExist
    });
    let expectedOutput = '==> numbers.txt <==\n3\n4\n';
    expectedOutput += '==> alphabets.txt <==\nc\nd';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should list whole contents if count is greater than number of lines", function () {
    let actualOutput = tail({
      action: getNTailLines,
      files: ['1\n2\n3\n4'],
      count: 6,
      filesName: ['numbers.txt'],
      fileExistenceChecker: doesFileExist
    });
    let expectedOutput = '1\n2\n3\n4';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should treat 0 as legal count", function () {
    let actualOutput = tail({
      action: getNTailLines,
      files: ['1\n2\n3\n4'],
      count: 0,
      filesName: ['numbers.txt'],
      fileExistenceChecker: doesFileExist
    });
    let expectedOutput = '';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should provide an error for invalid values for -n", function () {
    let actualOutput = tail({
      action: getNTailLines,
      files: ['1\n2\n3\n4'],
      count: '3t',
      filesName: ['numbers.txt'],
      fileExistenceChecker: doesFileExist
    });
    let expectedOutput = 'tail: illegal offset -- 3t';
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("extractFileContents", function () {
  it("should work for two args before file contents", function () {
    assert.deepEqual(extractFileContents([, , "-n", "3", "abc"]), ["abc"]);
  });
  it("should work for one arg before file contents", function () {
    assert.deepEqual(extractFileContents([, , "-n3", "abc"]), ["abc"]);
  });
  it("should work for no args before file contents", function () {
    assert.deepEqual(extractFileContents([, , "abc"]), ["abc"]);
  });
});

const mockFileExistSync = function (expectedFile,
  expectedEncoding,
  actualEncoding,
  actaulFile
) {
  return expectedEncoding == actualEncoding && expectedFile == actaulFile
}

const readerCreater = function (expectedFile, expectedEncoding, expectedOutput) {
  return function (fileToRead, encoding) {
    if (mockFileExistSync(expectedFile, expectedEncoding, encoding, fileToRead)) {
      return expectedOutput;
    }
  }
}

describe("readFile", function () {
  describe('readFile', function () {
    it('should return fileContent of file', function () {
      let errorMsg = 'head: alphabets.txt: No such file or directory';
      let reader = readerCreater('numbers.txt', 'utf8', 'one\ntwo\nthree\nfour');
      let existSync = mockFileExistSync.bind(null, 'numbers.txt', 'utf8', 'utf8');

      let actualOutput = readFile(reader, existSync, 'head', 'alphabets.txt');

      assert.deepEqual(actualOutput, errorMsg);
    });

    it('should return the file contents for exists required file', function () {
      let reader = readerCreater('numbers.txt', 'utf8', 'one\ntwo\nthree\nfour');
      let existSync = mockFileExistSync.bind(null, 'numbers.txt', 'utf8', 'utf8');

      let actualOutput = readFile(reader, existSync, 'head', 'numbers.txt');
      let expectedOutput = 'one\ntwo\nthree\nfour';

      assert.deepEqual(actualOutput, expectedOutput);
    })
  });
});

describe("readUserInputs", function () {

  describe("with getNHeadLines default function, should return parsed Inputs", function () {
    it("for separated count and option", function () {
      let actualOutput = readUserInputs(["node", "head.js", "-n", "3", "numbers.txt"]);
      let expectedOutput = {
        action: getNHeadLines,
        count: 3,
        filesName: ['numbers.txt'],
        files: ['numbers.txt'],
        fileExistenceChecker: undefined
      };
      assert.deepEqual(actualOutput, expectedOutput);
    });
    it("for attached count and option", function () {
      let actualOutput = readUserInputs(["node", "head.js", "-n3", "numbers.txt"]);
      let expectedOutput = {
        action: getNHeadLines,
        count: 3,
        filesName: ['numbers.txt'],
        files: ['numbers.txt'],
        fileExistenceChecker: undefined
      };
      assert.deepEqual(actualOutput, expectedOutput);
    });
    it("for no count and option", function () {
      let actualOutput = readUserInputs(["node", "head.js", "numbers.txt"]);
      let expectedOutput = {
        action: getNHeadLines,
        count: 10,
        filesName: ['numbers.txt'],
        files: ['numbers.txt'],
        fileExistenceChecker: undefined
      };
      assert.deepEqual(actualOutput, expectedOutput);
    });
  });
});


describe("with getFirstNCharacters function should return parsed Inputs", function () {

  it("for separated count and option", function () {
    let actualOutput = readUserInputs(["node", "head.js", "-c", "3", "numbers.txt"]);
    let expectedOutput = {
      action: getFirstNCharacters,
      count: 3,
      filesName: ['numbers.txt'],
      files: ['numbers.txt'],
      fileExistenceChecker: undefined
    };
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("for attached count and option", function () {
    let actualOutput = readUserInputs(["node", "head.js", "-c3", "numbers.txt"]);
    let expectedOutput = {
      action: getFirstNCharacters,
      count: 3,
      filesName: ['numbers.txt'],
      files: ['numbers.txt'],
      fileExistenceChecker: undefined
    };
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("for general test", function () {
  it("should retrieve default argument for if only fileName passing as argument", function () {
    assert.deepEqual(readUserInputs(["node", "head.js", "1\n2\3\n4\n5\n6\n7\n8\n9\n10\n11"]), { action: getNHeadLines, count: 10, filesName: ['1\n2\3\n4\n5\n6\n7\n8\n9\n10\n11'], files: ['1\n2\3\n4\n5\n6\n7\n8\n9\n10\n11'], fileExistenceChecker: undefined });
  });
  it("should treat 0 as legal count", function () {
    assert.deepEqual(readUserInputs(["node", "head.js", "-n0", "abc\ndef\nghi"]), { action: getNHeadLines, count: 0, filesName: ['abc\ndef\nghi'], files: ['abc\ndef\nghi'], fileExistenceChecker: undefined });
  });
});

describe("organizeInputs", function () {

  describe("with getNHeadLines default function", function () {
    it("should work for two arguments before file contents", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "-n", "3", "abc"]), { action: getNHeadLines, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for one arguments before file contents", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "-n3", "abc"]), { action: getNHeadLines, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for no argument before file contents", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "abc"]), { action: getNHeadLines, count: 10, files: ["abc"], filesName: ["abc"] });
    });
    it("should parse arguments with a space in betwen -n and the number", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "-n", "3", "abc"]), { action: getNHeadLines, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should parse arguments with a space in betwen -c and the number", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "-c", "3", "abc"]), { action: getFirstNCharacters, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should parse arguments with attached zero", function () {
      assert.deepEqual(organizeInputs(['node', "head.js", "-n0", "abc"]), { action: getNHeadLines, count: '0', files: ["abc"], filesName: ["abc"] });
    });
  });

  describe("with getFirstNCharacters function", function () {
    it("should work for two arguments before file contents", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "-c", "3", "abc"]), { action: getFirstNCharacters, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for one arguments before file contents", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "-c3", "abc"]), { action: getFirstNCharacters, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should test for 0 as count", function () {
      assert.deepEqual(organizeInputs(["node", "head.js", "-n0", "abc\ndef\nghi"]), { action: getNHeadLines, count: '0', filesName: ['abc\ndef\nghi'], files: ['abc\ndef\nghi'] });
    });
  });
  describe("with other general tests", function () {
    it("should handle default argument as getNHeadLines for action", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "abc"]), { action: getNHeadLines, count: 10, files: ["abc"], filesName: ["abc"] });
    });
    it("should show an error for invalid count", function () {
      assert.deepEqual(organizeInputs(['node', 'head.js', "-c", "abc"]), { action: getFirstNCharacters, count: 'error', files: ["abc"], filesName: ["abc"] });
    });
    it("should treat 0 as legal count", function () {
      assert.deepEqual(organizeInputs(["node", "head.js", "-n0", "abc\ndef\nghi"]), { action: getNHeadLines, count: '0', filesName: ['abc\ndef\nghi'], files: ['abc\ndef\nghi'] });
    });
  });
});

describe('extractAction', function () {
  it('should return getFirstNCharacter for head and -c', function () {
    assert.deepEqual(extractAction(['node', 'head.js', '-c', '3', 'abc']), getFirstNCharacters);
  });
  it('should return getLastNCharacter for tail and -c', function () {
    assert.deepEqual(extractAction(['node', 'tail.js', '-c', '3', 'abc']), getLastNCharacters);
  });
  it('should return getNTailLines for tail and -n', function () {
    assert.deepEqual(extractAction(['node', 'tail.js', '-n', '3', 'abc']), getNTailLines);
  });
});