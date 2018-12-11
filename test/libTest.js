const { deepEqual } = require('assert');
const {
  head,
  tail,
  extractFileContents,
  organizeInputs,
  readFile,
  readUserInputs
} = require('../src/lib.js');

const {
  getFirstNCharacters,
  getNHeadLines,
  getNTailLines,
  getLastNCharacters,
  identity
} = require('../src/libUtil.js');


describe("head", function () {
  it("should work for single file", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc"], count: 1, filesName: ["abc"] }), "abc");
  });
  it("should work for multiple files", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc\nabc\nabc", "cba"], filesName: ["abc\nabc\nabc", "cba"], count: 1 }), "==> abc\nabc\nabc <==\nabc\nabc\nabc\n==> cba <==\ncba");
  });
  it("should return 0 as an illegal line count", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc"], count: 0, filesName: ["abc"] }), "head: illegal line count -- 0");
  });
  it("should list the contents of the entire file if argument is greater than number of lines in file", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc\ndef\nghi"], count: 2, filesName: ["abc\ndef\nghi"] }), "abc\ndef\nghi");
  });
  it("should handle byte count option", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc\ndef\nghi"], count: '', filesName: ["abc\ndef\nghi"] }), "head: illegal line count -- ");
  });
});

describe("tail", function () {
  it("should work for single file", function () {
    deepEqual(tail({ action: getNTailLines, files: ["abc"], count: 1, filesName: ["abc"] }), "abc");
  });
  it("should work for multiple files", function () {
    deepEqual(tail({ action: getNTailLines, files: ["abc\nabc\nabc", "cba"], filesName: ["abc\nabc\nabc", "cba"], count: 1 }), "==> abc\nabc\nabc <==\nabc\nabc\nabc\n==> cba <==\ncba");
  });
  it("should list the contents of the entire file if argument is greater than number of lines in file", function () {
    deepEqual(tail({ action: getNTailLines, files: ["abc\ndef\nghi"], count: 2, filesName: ["abc\ndef\nghi"] }), "abc\ndef\nghi");
  });
  it("should treat 0 as legal count", function () {
    deepEqual(tail({ action: getNHeadLines, count: 0, filesName: ['abc\ndef\nghi'], files: ['abc\ndef\nghi'], fileExistenceChecker: undefined }),'');
  });
  it("should provide an error for invalid values for -n", function () {
    deepEqual(tail({ action: getNHeadLines, count: '3t', filesName: ['abc\ndef\nghi'], files: ['abc\ndef\nghi']}),'tail: illegal offset -- 3t');
  });
});

describe("extractFileContents", function () {
  it("should work for two args before file contents", function () {
    deepEqual(extractFileContents([, , "-n", "3", "abc"]), ["abc"]);
  });
  it("should work for one arg before file contents", function () {
    deepEqual(extractFileContents([, , "-n3", "abc"]), ["abc"]);
  });
  it("should work for no args before file contents", function () {
    deepEqual(extractFileContents([, , "abc"]), ["abc"]);
  });
});

describe("readFile", function () {
  it("should read the text with given reader", function () {
    deepEqual(readFile(identity, undefined, "head", "abc"), "abc");
  });
  it("should error msg for file not exists", function () {
    let doesExist = () => false;
    let reader = x => x;
    deepEqual(readFile(reader, doesExist, "head", "abc"), "head: abc: No such file or directory");
  });
});

describe("readUserInputs", function () {

  describe("with getNHeadLines default function", function () {
    it("should work for two arguments before file contents", function () {
      deepEqual(readUserInputs(["node", "head.js", "-n", "3", "abc"]), { action: getNHeadLines, count: 3, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
    it("should work for one arguments before file contents", function () {
      deepEqual(readUserInputs(["node", "head.js", "-n3", "abc"]), { action: getNHeadLines, count: 3, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
    it("should work for no argument before file contents", function () {
      deepEqual(readUserInputs(["node", "head.js", "abc"]), { action: getNHeadLines, count: 10, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
  });

  describe("with getFirstNCharacters function", function () {
    it("should work for two arguments before file contents", function () {
      deepEqual(readUserInputs(["node", "head.js", "-c", "3", "abc"]), { action: getFirstNCharacters, count: 3, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
    it("should work for one arguments before file contents", function () {
      deepEqual(readUserInputs(["node", "head.js", "-c3", "abc"]), { action: getFirstNCharacters, count: 3, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
  });
  describe("for general test", function () {
    it("should retrieve default argument for if only fileName passing as argument", function () {
      deepEqual(readUserInputs(["node", "head.js", "1\n2\3\n4\n5\n6\n7\n8\n9\n10\n11"]), { action: getNHeadLines, count: 10, filesName: ['1\n2\3\n4\n5\n6\n7\n8\n9\n10\n11'], files: ['1\n2\3\n4\n5\n6\n7\n8\n9\n10\n11'], fileExistenceChecker: undefined });
    });
    it("should treat 0 as legal count", function () {
      deepEqual(readUserInputs(["node", "tail.js", "-n0", "abc\ndef\nghi"]), { action: getNHeadLines, count: 0, filesName: ['abc\ndef\nghi'], files: ['abc\ndef\nghi'], fileExistenceChecker: undefined });
    });
  });
});


describe("organizeInputs", function () {

  describe("with getNHeadLines default function", function () {
    it("should work for two arguments before file contents", function () {
      deepEqual(organizeInputs([, , "-n", "3", "abc"]), { action: getNHeadLines, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for one arguments before file contents", function () {
      deepEqual(organizeInputs([, , "-n3", "abc"]), { action: getNHeadLines, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for no argument before file contents", function () {
      deepEqual(organizeInputs([, , "abc"]), { action: getNHeadLines, count: 10, files: ["abc"], filesName: ["abc"] });
    });
    it("should parse arguments with a space in betwen -n and the number", function () {
      deepEqual(organizeInputs([, , "-n", "3", "abc"]), { action: getNHeadLines, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should parse arguments with a space in betwen -c and the number", function () {
      deepEqual(organizeInputs([, , "-c", "3", "abc"]), { action: getFirstNCharacters, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should parse arguments with attached zero", function () {
      deepEqual(organizeInputs([, "head.js", "-n0", "abc"]), { action: getNHeadLines, count: '0', files: ["abc"], filesName: ["abc"] });
    });
  });

  describe("with getFirstNCharacters function", function () {
    it("should work for two arguments before file contents", function () {
      deepEqual(organizeInputs([, , "-c", "3", "abc"]), { action: getFirstNCharacters, count: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for one arguments before file contents", function () {
      deepEqual(organizeInputs([, , "-c3", "abc"]), { action: getFirstNCharacters, count: 3, files: ["abc"], filesName: ["abc"] });
    });
  });
  describe("with other general tests", function () {
    it("should handle default argument as getNHeadLines for action", function () {
      deepEqual(organizeInputs([, , "abc"]), { action: getNHeadLines, count: 10, files: ["abc"], filesName: ["abc"] });
    });
    it("should show an error for invalid count", function () {
      deepEqual(organizeInputs([, , "-c", "abc"]), { action: getFirstNCharacters, count: 'error', files: ["abc"], filesName: ["abc"] });
    });
    it("should treat 0 as legal count", function () {
      deepEqual(organizeInputs(["node", "tail.js","-n0","abc\ndef\nghi"]), { action: getNHeadLines, count: '0', filesName: ['abc\ndef\nghi'], files: ['abc\ndef\nghi']});
    });
  });
});