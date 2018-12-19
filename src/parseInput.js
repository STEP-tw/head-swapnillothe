const {
    extractCommand
} = require('./util/libUtil.js');

const {
    isNatural
} = require('./util/numbers.js');

const classifyInput = function (input) {
    if (isNatural(input[2][1])) {
        return {
            option: "n",
            numberOfLines: input[2].slice(1),
            fileNames: input.slice(3),
            command: extractCommand(input[1])
        };
    }

    if (isSeparateCountOption(input)) {
        return {
            option: input[2][1],
            numberOfLines: input[3],
            fileNames: input.slice(4),
            command: extractCommand(input[1])
        };
    }
    return {
        option: input[2][1],
        numberOfLines: input[2].slice(2),
        fileNames: input.slice(3),
        command: extractCommand(input[1])
    };
};

const parseInput = function (input) {
    if (hasDash(input[2])) {
        return classifyInput(input);
    }
    return {
        option: "n",
        numberOfLines: 10,
        fileNames: input.slice(2),
        command: extractCommand(input[1])
    };
};

const hasDash = (text) => text.includes('-');
const isTwo = (number) => number == 2;
const isSeparateCountOption = (input) => isTwo(input[2].length) && isNaN(input[2][1]);

module.exports = {
    parseInput,
    classifyInput
}