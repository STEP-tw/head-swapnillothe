const identity = function (data) {
    return data;
};

const formatText = function (text) {
    return `==> ${text} <==`;
};

const removeCharacter = function (text, character) {
    return text
        .split("")
        .filter(x => x != character)
        .join("");
};

const getFirstNCharacters = function (n, text) {
    return text.slice(0, n);
};

const getLastNCharacters = function (n, text) {
    return text.slice(-n);
}

const getNTailLines = function (n, text) {
    let tail = text.split('\n').slice(-n).join('\n');
    return tail;
}

const getNHeadLines = function (n, text) {
    let head = text.split("\n").filter((x, y) => y < n);
    return head.join("\n");
};

const insertHeaders = function (texts, headers, isEligible = identity) {
    let insertedHeaders = [];
    for (let index = 0; index < texts.length; index++) {
        if (isEligible(headers[index])) {
            insertedHeaders[index] = formatText(headers[index]) + "\n" + texts[index];
        } else {
            insertedHeaders[index] = texts[index];
        }
    }
    return insertedHeaders;
};

const applyActionIfExist = function (action, actionArg, objectsContent, objectsName, doesExists) {
    for (let index = 0; index < objectsContent.length; index++) {
        const doesFileExist = () =>
            doesExists && doesExists(objectsName[index]);
        if (doesFileExist()) {
            objectsContent[index] = action(actionArg, objectsContent[index]);
        }
    }
    return objectsContent;
}

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

const getIfTailError = function ({ count, action, filesName }) {
    const isNotZero = number => number != 0;

    if (count == "error" && action == getLastNCharacters) {
        return `tail: illegal offset -- ${filesName[0]}`;
    }
    if ((+count < 1 && action == getNTailLines && isNotZero(count)) || isNaN(+count)) {
        return `tail: illegal offset -- ${count}`;
    }
    return;
}



exports.identity = identity;
exports.formatText = formatText;
exports.removeCharacter = removeCharacter;
exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
exports.insertHeaders = insertHeaders;
exports.applyActionIfExist = applyActionIfExist;
exports.getNTailLines = getNTailLines;
exports.getLastNCharacters = getLastNCharacters;
exports.getIfHeadError = getIfHeadError;
exports.getIfTailError = getIfTailError;