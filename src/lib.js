const {
  identity,
  removeCharacter,
  getFirstNCharacters,
  getNHeadLines,
  insertHeaders
} = require('./libUtil.js');


const readFile = function (reader, doesFileExist, file) {
  if (reader != identity && !doesFileExist(file)) {
    return `head: ${file}: No such file or directory`;
  }
  return reader(file, "utf8");
};

const head = function ({
  action,
  files,
  headLineNumbers,
  filesName,
  fileExistenceChecker
}) {
  
  for (let index = 0; index < files.length; index++) {
    const doesFileExist = () =>
      fileExistenceChecker && fileExistenceChecker(filesName[index]);
    if (doesFileExist()) {
      files[index] = action( headLineNumbers, files[index] );
    }
  }
  let requiredHead = files;
  if (
    (+headLineNumbers < 1 || isNaN(+headLineNumbers)) &&
    action == getNHeadLines
  ) {
    return `head: illegal line count -- ${headLineNumbers}`;
  }
  if (headLineNumbers == "error" && action == getFirstNCharacters) {
    return `head: illegal byte count -- ${filesName[0]}`;
  }

  if (isNaN(+headLineNumbers) && action == getFirstNCharacters) {
    return `head: illegal byte count -- ${headLineNumbers}`;
  }
  if (files.length > 1) {
    requiredHead = insertHeaders(requiredHead, filesName, fileExistenceChecker);
  }
  return requiredHead.join("\n");
};

const readUserInputs = function (inputs, read = identity, fileExistenceChecker) {
  let { action, files, headLineNumbers, filesName } = organizeInputs(inputs);
  files = filesName.map(readFile.bind(null, read, fileExistenceChecker));
  return { action, headLineNumbers, files, filesName, fileExistenceChecker };
};

const extractFileContents = function (dataContents) {
  if (dataContents[2][0] != "-") {
    return dataContents.slice(2, dataContents.length);
  }
  if (+dataContents[3]) {
    return dataContents.slice(4, dataContents.length);
  }
  return dataContents.slice(3, dataContents.length);
};

const organizeInputs = function (inputs) {
  let action = getNHeadLines;
  let actionSign = ["-", "n", "c"];
  let filesName = (files = extractFileContents(inputs));
  let headLineNumbers = actionSign.reduce(removeCharacter, inputs[2]);

  if (inputs.some(x => x.match("-c"))) {
    action = getFirstNCharacters;
  }

  if (inputs[2] == "-c" && isNaN(inputs[3])) {
    headLineNumbers = "error";
    return { action, headLineNumbers, files, filesName };
  }

  if (
    (inputs[2].includes("-c") || inputs[2].includes("-n")) &&
    inputs[2].length != 2
  ) {
    headLineNumbers = inputs[2].slice(2, inputs[2].length);
    return { action, headLineNumbers, files, filesName };
  }

  if (headLineNumbers < 1 && headLineNumbers != "") {
    return { action, headLineNumbers, files, filesName };
  }

  headLineNumbers = +headLineNumbers || +inputs[3] || 10;
  return { action, headLineNumbers, files, filesName };
};

exports.head = head;
exports.extractFileContents = extractFileContents;
exports.organizeInputs = organizeInputs;
exports.readFile = readFile;
exports.readUserInputs = readUserInputs;