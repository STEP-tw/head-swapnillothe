const {
    extractCommand
} = require('./util/libUtil.js');

const {
    isNatural
} = require('./util/numbers.js');

const createClassifiedArgs = function (option, count, fileNames, command) {
    return { option, count, fileNames, command };
}

const parseInput = function (args) {
    let countOrOption = args[2];
    let probableCount = args[3];
    let fileIndexStarter = getFileIndex(countOrOption);
    let fileNames = args.slice(fileIndexStarter);
    let command = extractCommand(args[1]);
    let option = getOption(countOrOption);
    let count = getCount(countOrOption, probableCount);
    return createClassifiedArgs(option, count, fileNames, command);
};

let getCount = function (countOrOption, probableCount) {
    let defaultCount = countOrOption.slice(2);
    if (isSeparateCountOption(countOrOption)) {
        return probableCount;
    }
    if (isNatural(countOrOption[1])) {
        return countOrOption.slice(1);
    }
    if (!hasDash(countOrOption)) {
        return 10;
    }
    return defaultCount
}

const getOption = function (countOrOption) {
    if (isOptionN(countOrOption, countOrOption[1])) {
        return 'n';
    }
    return countOrOption[1];
}

const getFileIndex = (countOrOption) => {
    if (isSeparateCountOption(countOrOption)) {
        return 4;
    }
    if (hasDash(countOrOption)) {
        return 3;
    }
    return 2;
};

const isTrue = (value)=>value==true;
const isOptionN = (option, count) => (!hasDash(option) || isNatural(count));
const hasDash = (text) => text.startsWith('-');
const isTwo = (number) => number == 2;
const isSeparateCountOption = (content) => isTwo(content.length) && isNaN(content[1]);

module.exports = {
    parseInput
}