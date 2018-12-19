const identity = function (data) {
    return data;
};

const formatText = function (text) {
    return `==> ${text} <==`;
};

const getFirstNCharacters = function (n, text) {
    return text.slice(0, n);
};

const getLastNCharacters = function (n, text) {
    return text.slice(-n);
}

const getNTailLines = function (n, text) {
    return text.split('\n').slice(-n).join('\n');
}

const getNHeadLines = function (n, text) {
    let head = text.split("\n").slice(0, n);
    return head.join("\n");
};

const insertHeaders = function (texts, headers, isEligible = identity) {
    let insertedHeaders = [];
    for (let index = 0; index < texts.length; index++) {
        insertedHeaders[index] = texts[index];
        if (isEligible(headers[index])) {
            insertedHeaders[index] = formatText(headers[index]) + "\n" + texts[index];
        }
    }
    return insertedHeaders;
};

const applyActionIfExist = function (
    action,
    actionArg,
    objectContents,
    objectNames,
    doesExists
) {
    for (let index = 0; index < objectContents.length; index++) {
        const doesFileExist = () => doesExists && doesExists(objectNames[index]);
        if (doesFileExist()) {
            objectContents[index] = action(actionArg, objectContents[index]);
        }
    }
    return objectContents;
}

const doesContainC = (contents) => contents.some(content => content.match('-c'));

const isCountInvalid = (contents) => contents[2] == "-c" && isNaN(contents[3]);

const doesAttachOption = (contents) => (contents.includes("-c") || contents.includes("-n")) &&
    contents.length != 2;

const doesNeedHeaders = (files) => (files.length > 1);

const extractCommand = (content) => content.slice(content.length - 7, content.length - 3)

module.exports = {
    identity,
    formatText,
    getFirstNCharacters,
    getNHeadLines,
    insertHeaders,
    applyActionIfExist,
    getNTailLines,
    getLastNCharacters,
    doesNeedHeaders,
    doesAttachOption,
    doesContainC,
    isCountInvalid,
    extractCommand,
}