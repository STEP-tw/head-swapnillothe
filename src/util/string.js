const removeCharacter = function (text, character) {
    return text
        .split("")
        .filter(charToRemove => charToRemove != character)
        .join("");
};

const sliceFrom = (content, start) => content.slice(start, content.length);

module.exports = {
    removeCharacter,
    sliceFrom
}