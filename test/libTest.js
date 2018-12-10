const { deepEqual } = require('assert');
const {
  head,
  extractFileContents,
  organizeInputs,
  readFile,
  readUserInputs
} = require('../src/lib.js');

const { 
  getFirstNCharacters, 
  getNHeadLines,
  identity
} = require('../src/libUtil.js');


describe("head", function () {
  it("should work for single file", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc"], headLineNumbers: 1, filesName: ["abc"] }), "abc");
  });
  it("should work for multiple files", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc\nabc\nabc", "cba"], filesName: ["abc\nabc\nabc", "cba"], headLineNumbers: 1 }), "==> abc\nabc\nabc <==\nabc\nabc\nabc\n==> cba <==\ncba");
  });
  it("should return 0 as an illegal line count", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc"], headLineNumbers: 0, filesName: ["abc"] }), "head: illegal line count -- 0");
  });
  it("should list the contents of the entire file if argument is greater than number of lines in file", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc\ndef\nghi"], headLineNumbers: 2, filesName: ["abc\ndef\nghi"] }), "abc\ndef\nghi");
  });
  it("should handle byte count option", function () {
    deepEqual(head({ action: getNHeadLines, files: ["abc\ndef\nghi"], headLineNumbers: '', filesName: ["abc\ndef\nghi"] }), "head: illegal line count -- ");
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
    deepEqual(readFile(identity, undefined, "abc"), "abc");
  });
});

describe("readUserInputs", function () {

  describe("with getNHeadLines default function", function () {
    it("should work for two arguments before file contents", function () {
      deepEqual(readUserInputs([, , "-n", "3", "abc"]), { action: getNHeadLines, headLineNumbers: 3, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
    it("should work for one arguments before file contents", function () {
      deepEqual(readUserInputs([, , "-n3", "abc"]), { action: getNHeadLines, headLineNumbers: 3, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
    it("should work for no argument before file contents", function () {
      deepEqual(readUserInputs([, , "abc"]), { action: getNHeadLines, headLineNumbers: 10, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
  });

  describe("with getFirstNCharacters function", function () {
    it("should work for two arguments before file contents", function () {
      deepEqual(readUserInputs([, , "-c", "3", "abc"]), { action: getFirstNCharacters, headLineNumbers: 3, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
    it("should work for one arguments before file contents", function () {
      deepEqual(readUserInputs([, , "-c3", "abc"]), { action: getFirstNCharacters, headLineNumbers: 3, filesName: ['abc'], files: ["abc"], fileExistenceChecker: undefined });
    });
  });
});


describe("organizeInputs", function () {

  describe("with getNHeadLines default function", function () {
    it("should work for two arguments before file contents", function () {
      deepEqual(organizeInputs([, , "-n", "3", "abc"]), { action: getNHeadLines, headLineNumbers: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for one arguments before file contents", function () {
      deepEqual(organizeInputs([, , "-n3", "abc"]), { action: getNHeadLines, headLineNumbers: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for no argument before file contents", function () {
      deepEqual(organizeInputs([, , "abc"]), { action: getNHeadLines, headLineNumbers: 10, files: ["abc"], filesName: ["abc"] });
    });
    it("should parse arguments with a space in betwen -n and the number", function () {
      deepEqual(organizeInputs([, , "-n", "3", "abc"]), { action: getNHeadLines, headLineNumbers: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should parse arguments with a space in betwen -c and the number", function () {
      deepEqual(organizeInputs([, , "-c", "3", "abc"]), { action: getFirstNCharacters, headLineNumbers: 3, files: ["abc"], filesName: ["abc"] });
    });
  });

  describe("with getFirstNCharacters function", function () {
    it("should work for two arguments before file contents", function () {
      deepEqual(organizeInputs([, , "-c", "3", "abc"]), { action: getFirstNCharacters, headLineNumbers: 3, files: ["abc"], filesName: ["abc"] });
    });
    it("should work for one arguments before file contents", function () {
      deepEqual(organizeInputs([, , "-c3", "abc"]), { action: getFirstNCharacters, headLineNumbers: 3, files: ["abc"], filesName: ["abc"] });
    });
  });
  describe("with other general tests", function () {
    it("should handle default argument as getNHeadLines for action", function () {
      deepEqual(organizeInputs([, , "abc"]), { action: getNHeadLines, headLineNumbers: 10, files: ["abc"], filesName: ["abc"] });
    });
    it("should show an error for invalid headLineNumbers", function () {
      deepEqual(organizeInputs([, , "-c", "abc"]), { action: getFirstNCharacters, headLineNumbers: 'error', files: ["abc"], filesName: ["abc"] });
    });
  });
});