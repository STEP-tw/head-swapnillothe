const {
    parseInput,
    classifyInput
} = require('../src/parseInput.js');

const assert = require('assert');

describe("classifyInput", function () {

    describe("should return classifiedInputs contains option, numberOfLines, command and file names", function () {
        
        it("if only count and file is given", () => {
            let actualOutput = classifyInput(["node", "head.js", "-5", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 5,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if only count and multiple files are given", function () {
            let actualOutput = classifyInput(["node", "head.js",
                "-10",
                "file.txt",
                "file2.txt",
                "file3.txt"
            ]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 10,
                files: ["file.txt", "file2.txt", "file3.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option with attachment of count is given ", function () {
            let actualOutput = classifyInput(["node", "head.js", "-n2", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 2,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("for separated count and option", function () {
            let actualOutput = classifyInput(["node", "head.js", "-n", "10", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 10,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("all means files, count and option are given separately", function () {
            let actualOutput = classifyInput(["node", "head.js", "-n", "-1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: -1,
                files: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option 'c' and count are given together", function () {
            let actualOutput = classifyInput(["node", "head.js", "-c1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                numberOfLines: 1,
                files: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option 'c' and count are given seperately for single file", function () {
            let actualOutput = classifyInput(["node", "head.js", "-c", "1", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                numberOfLines: 1,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("for separated c option and count for multiple files", function () {
            let actualOutput = classifyInput(["node", "head.js", "-c", "1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                numberOfLines: 1,
                files: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });
    });
});

describe("parseInput", function () {

    describe("should return parsedInputs contains option, numberOfLines, command and file names", function () {

        it("if only file is given", function () {
            let actualOutput = parseInput(["node", "head.js", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 10,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if only multiple files are given", function () {
            let actualOutput = parseInput(["node", "head.js", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 10,
                files: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if only count and a file is given", () => {
            let actualOutput = parseInput(["node", "head.js", "-5", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 5,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if only count and multiple files are given", function () {
            let actualOutput = parseInput(["node", "head.js",
                "-10",
                "file.txt",
                "file2.txt",
                "file3.txt"
            ]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 10,
                files: ["file.txt", "file2.txt", "file3.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option and count are given together", function () {
            let actualOutput = parseInput(["node", "head.js", "-n1", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 1,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option and count are given separately", function () {
            let actualOutput = parseInput(["node", "head.js", "-n", "10", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: 10,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if the count is negative", function () {
            let actualOutput = parseInput(["node", "head.js", "-n", "-1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                numberOfLines: -1,
                files: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option 'c' and count are given together", function () {
            let actualOutput = parseInput(["node", "head.js", "-c1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                numberOfLines: 1,
                files: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option 'c' and count are given separately", function () {
            let actualOutput = parseInput(["node", "head.js", "-c", "1", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                numberOfLines: 1,
                files: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option 'c' and count are given with multiple files", function () {
            let actualOutput = parseInput(["node", "head.js", "-c", "1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                numberOfLines: 1,
                files: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });
    });
});