const identity = function (data) {
    return data;
};

const formatText = function (text) {
    return `==> ${text} <==`;
};

const removeCharacter = function (text, character) {
    return text
        .split("")
        .filter(charToRemove => charToRemove != character)
        .join("");
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
    let head = text.split("\n").filter((x, y) => y < n);
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

const applyActionIfExist = function (action, actionArg, objectsContent, objectsName, doesExists) {
    for (let index = 0; index < objectsContent.length; index++) {
        const doesFileExist = () => doesExists && doesExists(objectsName[index]);
        if (doesFileExist()) {
            objectsContent[index] = action(actionArg, objectsContent[index]);
        }
    }
    return objectsContent;
}

const doesContainC = (contents) => contents.some(content => content.match('-c'));

const isCountInvalid = (contents) => contents[2] == "-c" && isNaN(contents[3]);

const doesAttachOption = (contents) => (contents.includes("-c") || contents.includes("-n")) &&
    contents.length != 2;

const doesNeedHeaders = (files) => (files.length > 1);

const isNotNatural = (number) => number < 1;

const sliceFrom = (content, start) => content.slice(start, content.length);

const getIfHeadError = function ({ count, action, filesName }) {
    if (
        (+count < 1 || isNaN(+count)) &&
        action == getNHeadLines
    ) {
        return `head: illegal line count -- ${count}`;
    }
    if (count == "error" && action == getFirstNCharacters) {
        return `head: illegal byte count -- ${filesName[0]}`;
    }

    if (isNaN(+count) && action == getFirstNCharacters) {
        return `head: illegal byte count -- ${count}`;
    }
    return;
}

const isNotZero = number => number != 0;

const recorrectCount = function (contents, count) {
    return (+count || +contents[3] || 10);
}

const getIfTailError = function ({ count, action, filesName }) {
    if (count == "error" && action == getLastNCharacters) {
        return `tail: illegal offset -- ${filesName[0]}`;
    }
    if ((+count < 1 && action == getNTailLines && isNotZero(count)) || isNaN(+count)) {
        return `tail: illegal offset -- ${count}`;
    }
    return;
}

const extractCommand = (content) => content.slice(content.length - 7, content.length - 3)

module.exports = {
    identity,
    formatText,
    removeCharacter,
    getFirstNCharacters,
    getNHeadLines,
    insertHeaders,
    applyActionIfExist,
    getNTailLines,
    getLastNCharacters,
    getIfHeadError,
    getIfTailError,
    isNotNatural,
    doesNeedHeaders,
    doesAttachOption,
    sliceFrom,
    doesContainC,
    isCountInvalid,
    extractCommand,
    isNotZero,
    recorrectCount
}