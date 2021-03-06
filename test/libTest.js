const assert = require('assert');
const {
  head,
  tail,
  readFile,
  readUserInputs,
  extractAction,
  getAction
} = require('../src/lib.js');

const {
  getFirstNCharacters,
  getNHeadLines,
  getNTailLines,
  getLastNCharacters,
} = require('../src/util/libUtil');


describe("head", function () {

  it("should return single line of file for count 1 and single file", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ["abc"],
      count: 1,
      fileNames: ["abc"]
    });
    assert.deepEqual(actualOutput, "abc");
  });

  it("should return file contents with their headers for multiple files", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ['1\n2\n3\n4\n5', 'a\nb\nc\nd'],
      count: 1,
      fileNames: ['numbers.txt', 'alphabets.txt']
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
      fileNames: ['numbers.txt', 'alphabets.txt']
    });
    let expectedOutput = 'head: illegal line count -- 0';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should list all contents if count is greater than number of lines", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ['1\n2\n3\n4\n5'],
      count: 6,
      fileNames: ['numbers.txt']
    });
    let expectedOutput = '1\n2\n3\n4\n5';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return byte count error if count is nothing", function () {
    let actualOutput = head({
      action: getNHeadLines,
      files: ['1\n2\n3\n4\n5'],
      count: '',
      fileNames: ['numbers.txt']
    });
    let expectedOutput = 'head: illegal line count -- ';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return byte count error for invalid count", function () {
    let actualOutput = head({
      action: getFirstNCharacters,
      files: ['1\n2\n3\n4\n5'],
      count: 't',
      fileNames: ['numbers.txt']
    });
    let expectedOutput = 'head: illegal byte count -- t';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should return line count error with fileName if count is error", function () {
    let actualOutput = head({
      action: getFirstNCharacters,
      files: ['1\n2\n3\n4\n5'],
      count: 'numbers.txt',
      fileNames: ['numbers.txt']
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
      fileNames: ['numbers.txt'],
      fileExistenceChecker: doesFileExist
    });
    let expectedOutput = '4';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should tail for multiple files and count more than one", function () {
    let actualOutput = tail({
      action: getNTailLines,
      files: ['1\n2\n3\n4', 'a\nb\nc\nd'],
      count: 2,
      fileNames: ['numbers.txt', 'alphabets.txt'],
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
      fileNames: ['numbers.txt'],
      fileExistenceChecker: doesFileExist
    });
    let expectedOutput = '1\n2\n3\n4';
    assert.deepEqual(actualOutput, expectedOutput);
  });

  it("should treat 0 as legal count and return nothing", function () {
    let actualOutput = tail({
      action: getNTailLines,
      files: ['1\n2\n3\n4'],
      count: 0,
      fileNames: ['numbers.txt'],
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
      fileNames: ['numbers.txt'],
      fileExistenceChecker: doesFileExist
    });
    let expectedOutput = 'tail: illegal offset -- 3t';
    assert.deepEqual(actualOutput, expectedOutput);
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

    it('should return fileContent of given required file', function () {
      let errorMsg = 'head: alphabets.txt: No such file or directory';
      let reader = readerCreater('numbers.txt', 'utf8', 'one\ntwo\nthree\nfour');
      let existSync = mockFileExistSync.bind(null, 'numbers.txt', 'utf8', 'utf8');

      let actualOutput = readFile(reader, existSync, 'head', 'alphabets.txt');

      assert.deepEqual(actualOutput, errorMsg);
    });

    it('should return the file contents for exists and required file', function () {
      let reader = readerCreater('numbers.txt', 'utf8', 'one\ntwo\nthree\nfour');
      let existSync = mockFileExistSync.bind(null, 'numbers.txt', 'utf8', 'utf8');

      let actualOutput = readFile(reader, existSync, 'head', 'numbers.txt');
      let expectedOutput = 'one\ntwo\nthree\nfour';

      assert.deepEqual(actualOutput, expectedOutput);
    })
  });
});

describe("readUserInputs", function () {

  describe("with getNHeadLines function, should return parsed Inputs", function () {

    it("for separated count and option", function () {
      let actualOutput = readUserInputs(["node", "head.js", "-n", "3", "numbers.txt"]);
      let expectedOutput = {
        action: getNHeadLines,
        count: 3,
        fileNames: ['numbers.txt'],
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
        fileNames: ['numbers.txt'],
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
        fileNames: ['numbers.txt'],
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
      fileNames: ['numbers.txt'],
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
      fileNames: ['numbers.txt'],
      files: ['numbers.txt'],
      fileExistenceChecker: undefined
    };
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("for general test", function () {
  it("should retrieve default argument for if only fileName passing as argument", function () {
    let userInputs = ["node", "head.js", "numbers.txt"];
    let actualOutput = readUserInputs(userInputs);
    let expectedOutput = {
      action: getNHeadLines,
      count: 10,
      fileNames: ['numbers.txt'],
      files: ['numbers.txt'],
      fileExistenceChecker: undefined
    }
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe('getAction', function () {

  it('should return getFirstNCharacter for head and -c', function () {
    let actualAction = getAction('head','c');
    let expectedAction = getFirstNCharacters;
    assert.deepEqual(actualAction, expectedAction);
  });

  it('should return getLastNCharacter for tail and -c', function () {
    let actualAction = getAction('tail','c');
    let expectedAction = getLastNCharacters;
    assert.deepEqual(actualAction, expectedAction);
  });
  
  it('should return getNTailLines for tail and -n', function () {
    let actualAction = getAction('tail','n');
    let expectedAction = getNTailLines;
    assert.deepEqual(actualAction, expectedAction);
  });
});