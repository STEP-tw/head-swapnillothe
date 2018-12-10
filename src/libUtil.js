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

exports.identity = identity;
exports.formatText = formatText;
exports.removeCharacter = removeCharacter;
exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
exports.insertHeaders = insertHeaders