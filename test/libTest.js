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
} = require('../src/util/libUtil');


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
      count: 'numbers.txt',
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

  it("should tail for multiple files and count more than one", function () {
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

  it("should treat 0 as legal count and return nothing", function () {
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

  it("should extract file contents for two args before file contents", function () {
    assert.deepEqual(extractFileContents([, , "-n", "3", "abc"]), ["abc"]);
  });

  it("should extract file contents for one arg before file contents", function () {
    assert.deepEqual(extractFileContents([, , "-n3", "abc"]), ["abc"]);
  });

  it("should extract file contents for no args before file contents", function () {
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
    let userInputs = ["node", "head.js", "numbers.txt"];
    let actualOutput = readUserInputs(userInputs);
    let expectedOutput = {
      action: getNHeadLines,
      count: 10,
      filesName: ['numbers.txt'],
      files: ['numbers.txt'],
      fileExistenceChecker: undefined
    }
    assert.deepEqual(actualOutput, expectedOutput);
  });
});

describe("organizeInputs", function () {

  describe("with getNHeadLines function, return well organized input", function () {

    it("with separated count and option", function () {
      let inputs = ['node', 'head.js', '-n', '3', 'numbers.txt'];
      let actualOutput = organizeInputs(inputs);
      let expectedOutput = {
        action: getNHeadLines,
        count: 3,
        filesName: ['numbers.txt']
      }
      assert.deepEqual(actualOutput, expectedOutput);
    });

    it("with attached count and option", function () {
      let inputs = ['node', 'head.js', '-n3', 'numbers.txt'];
      let actualOutput = organizeInputs(inputs);
      let expectedOutput = {
        action: getNHeadLines,
        count: 3,
        filesName: ['numbers.txt']
      }
      assert.deepEqual(actualOutput, expectedOutput);
    });

    it("without count and option", function () {
      let inputs = ['node', 'head.js', 'numbers.txt'];
      let actualOutput = organizeInputs(inputs);
      let expectedOutput = {
        action: getNHeadLines,
        count: 10,
        filesName: ['numbers.txt']
      }
      assert.deepEqual(actualOutput, expectedOutput);
    });

    it("with separated count c and option", function () {
      let inputs = ['node', 'head.js', '-c', '10', 'numbers.txt'];
      let actualOutput = organizeInputs(inputs);
      let expectedOutput = {
        action: getFirstNCharacters,
        count: 10,
        filesName: ['numbers.txt']
      }
      assert.deepEqual(actualOutput, expectedOutput);
    });

    it("should parse arguments with attached zero", function () {
      let inputs = ['node', 'head.js', '-c0', 'numbers.txt'];
      let actualOutput = organizeInputs(inputs);
      let expectedOutput = {
        action: getFirstNCharacters,
        count: 0,
        filesName: ['numbers.txt']
      }
      assert.deepEqual(actualOutput, expectedOutput);
    });
  });

  describe("with getFirstNCharacters function, should return organized input", function () {

    it("for separated count and option", function () {
      let input = ['node', 'head.js', '-c', '3', 'file'];
      let actualOutput = organizeInputs(input);
      let expectedOutput = {
        action: getFirstNCharacters,
        count: 3,
        filesName: ['file']
      };
      assert.deepEqual(actualOutput, expectedOutput);
    });

    it("for attched count and option", function () {
      let input = ['node', 'head.js', '-c3', 'file'];
      let actualOutput = organizeInputs(input);
      let expectedOutput = {
        action: getFirstNCharacters,
        count: 3,
        filesName: ['file']
      };
      assert.deepEqual(actualOutput, expectedOutput);
    });

    it("for count 0 and option", function () {
      let input = ['node', 'head.js', '-c0', 'file'];
      let actualOutput = organizeInputs(input);
      let expectedOutput = {
        action: getFirstNCharacters,
        count: 0,
        filesName: ['file']
      };
      assert.deepEqual(actualOutput, expectedOutput);
    });
  });

  describe("with other general tests", function () {

    it("should handle default argument as getNHeadLines for action", function () {
      let input = ['node', 'head.js', 'file'];
      let actualOutput = organizeInputs(input);
      let expectedOutput = {
        action: getNHeadLines,
        count: 10,
        filesName: ['file']
      }
      assert.deepEqual(actualOutput, expectedOutput);
    });

    it("should show an error for invalid count", function () {
      let input = ['node', 'head.js', '-c', 'file'];
      let actualOutput = organizeInputs(input);
      let expectedOutput = {
        action: getFirstNCharacters,
        count: 'file',
        filesName: ['file']
      }
      assert.deepEqual(actualOutput, expectedOutput);
    });

    it("should treat 0 as legal count", function () {
      let input = ['node', 'head.js', '-c0', 'file'];
      let actualOutput = organizeInputs(input);
      let expectedOutput = {
        action: getFirstNCharacters,
        count: '0',
        filesName: ['file']
      }
      assert.deepEqual(actualOutput, expectedOutput);
    });
  });
});

describe('extractAction', function () {

  it('should return getFirstNCharacter for head and -c', function () {
    let actualAction = extractAction(['node', 'head.js', '-c', '3', 'abc']);
    let expectedAction = getFirstNCharacters;
    assert.deepEqual(actualAction, expectedAction);
  });

  it('should return getLastNCharacter for tail and -c', function () {
    let actualAction = extractAction(['node', 'tail.js', '-c', '3', 'file']);
    let expectedAction = getLastNCharacters;
    assert.deepEqual(actualAction, expectedAction);
  });
  
  it('should return getNTailLines for tail and -n', function () {
    let actualAction = extractAction(['node', 'tail.js', '-n', '3', 'file'])
    let expectedAction = getNTailLines;
    assert.deepEqual(actualAction, expectedAction);
  });
});