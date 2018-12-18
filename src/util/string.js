const removeCharacter = function (text, character) {
    return text
        .split("")
        .filter(charToRemove => charToRemove != character)
        .join("");
};

module.exports = {
    removeCharacter
}