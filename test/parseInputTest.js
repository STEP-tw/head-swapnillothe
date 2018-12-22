const {
    parseInput,
} = require('../src/parseInput.js');

const assert = require('assert');

describe("parseInput", function () {

    describe("should return parsedInputs contains option, count, command and file names", function () {

        it("if only file is given", function () {
            let actualOutput = parseInput(["node", "head.js", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                count: 10,
                fileNames: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if only multiple fileNames are given", function () {
            let actualOutput = parseInput(["node", "head.js", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                count: 10,
                fileNames: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if only count and a file is given", () => {
            let actualOutput = parseInput(["node", "head.js", "-5", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                count: 5,
                fileNames: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if only count and multiple fileNames are given", function () {
            let actualOutput = parseInput(["node", "head.js",
                "-10",
                "file.txt",
                "file2.txt",
                "file3.txt"
            ]);
            let expectedOutput = {
                command: "head",
                option: "n",
                count: 10,
                fileNames: ["file.txt", "file2.txt", "file3.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option and count are given together", function () {
            let actualOutput = parseInput(["node", "head.js", "-n1", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                count: 1,
                fileNames: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option and count are given separately", function () {
            let actualOutput = parseInput(["node", "head.js", "-n", "10", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                count: 10,
                fileNames: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if the count is negative", function () {
            let actualOutput = parseInput(["node", "head.js", "-n", "-1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "n",
                count: -1,
                fileNames: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option 'c' and count are given together", function () {
            let actualOutput = parseInput(["node", "head.js", "-c1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                count: 1,
                fileNames: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option 'c' and count are given separately", function () {
            let actualOutput = parseInput(["node", "head.js", "-c", "1", "file.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                count: 1,
                fileNames: ["file.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });

        it("if option 'c' and count are given with multiple fileNames", function () {
            let actualOutput = parseInput(["node", "head.js", "-c", "1", "file.txt", "file2.txt"]);
            let expectedOutput = {
                command: "head",
                option: "c",
                count: 1,
                fileNames: ["file.txt", "file2.txt"]
            };
            assert.deepEqual(actualOutput, expectedOutput);
        });
    });
});