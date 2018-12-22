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
    let fileIndexStarter = getFileIndex(countOrOption);
    let fileNames = args.slice(fileIndexStarter);
    let command = extractCommand(args[1]);
    let option = getOption(args);
    let count = getCount(args);
    return createClassifiedArgs(option, count, fileNames, command);
};

let getCount = function (args) {
    let countOrOption = args[2];
    let count = countOrOption.slice(2);
    if (isSeparateCountOption(countOrOption)) {
        return args[3];
    }
    if (isNatural(countOrOption[1])) {
        return countOrOption.slice(1);
    }
    if (!hasDash(countOrOption)) {
        return 10;
    }
    return count
}

const getOption = function (args) {
    let countOrOption = args[2];
    let possibleOptionOrCount = countOrOption[1];
    let option = countOrOption[1];
    if (isOptionN(countOrOption, possibleOptionOrCount)) {
        return 'n';
    }
    return option;
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

const isOptionN = (option, count) => (!hasDash(option) || isNatural(count));
const hasDash = (text) => text.startsWith('-');
const isTwo = (number) => number == 2;
const isSeparateCountOption = (content) => isTwo(content.length) && isNaN(content[1]);

module.exports = {
    parseInput
}