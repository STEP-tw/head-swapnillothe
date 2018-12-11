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

exports.identity = identity;
exports.formatText = formatText;
exports.removeCharacter = removeCharacter;
exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
exports.insertHeaders = insertHeaders;
exports.applyActionIfExist = applyActionIfExist;
exports.getNTailLines = getNTailLines;
exports.getLastNCharacters = getLastNCharacters;