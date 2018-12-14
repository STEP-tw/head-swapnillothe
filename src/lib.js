const {
  identity,
  removeCharacter,
  getFirstNCharacters,
  getNHeadLines,
  insertHeaders,
  applyActionIfExist,
  getLastNCharacters,
  getNTailLines,
  getIfHeadError,
  getIfTailError,
  doesContainC,
  isCountInvalid,
  doesAttachOption,
  doesNeedHeaders,
  isNotNatural,
  sliceFrom
} = require('./libUtil.js');

const readFile = function (reader, doesFileExist, title = 'head', file) {
  if (reader != identity && !doesFileExist(file)) {
    return `${title}: ${file}: No such file or directory`;
  }
  return reader(file, "utf8");
};

const tail = function ({
  action,
  files,
  count,
  filesName,
  fileExistenceChecker
}) {
  if (action == getFirstNCharacters) {
    action = getLastNCharacters;
  } else {
    action = getNTailLines;
  }

  let requiredTail = applyActionIfExist(action, count, files, filesName, fileExistenceChecker);

  const error = getIfTailError({ count, action, filesName });
  if (error) { return error };
  if (isNotNatural(+count)) {
    requiredTail = files.map(files => '');
  }
  if (doesNeedHeaders(files)) {
    requiredTail = insertHeaders(requiredTail, filesName, fileExistenceChecker);
  }
  return requiredTail.join('\n');
}

const head = function ({ action, files, count, filesName, fileExistenceChecker }) {
  let requiredHead = applyActionIfExist(action, count, files, filesName, fileExistenceChecker);
  let error = getIfHeadError({ count, action, filesName });
  if (error) { return error };
  if (doesNeedHeaders(files)) {
    requiredHead = insertHeaders(requiredHead, filesName, fileExistenceChecker);
  }
  return requiredHead.join("\n");
};

const readUserInputs = function (inputs, read = identity, fileExistenceChecker) {
  let { action, files, count, filesName } = organizeInputs(inputs);
  let command = inputs[1].slice(inputs[1].length - 7, inputs[1].length - 3);
  files = filesName.map(readFile.bind(null, read, fileExistenceChecker, command));
  return { action, count, files, filesName, fileExistenceChecker };
};

const extractFileContents = function (dataContents) {
  if (dataContents[2][0] != "-") {
    return sliceFrom(dataContents, 2);
  }
  if (+dataContents[3]) {
    return sliceFrom(dataContents, 4);
  }
  return sliceFrom(dataContents, 3);
};

const extractAction = function (contents) {
  if (doesContainC(contents)) {
    return getFirstNCharacters;
  }
  return getNHeadLines;
}

const correctCount = function (contents, count) {
  if (isCountInvalid(contents)) {
    return "error";
  }
  if (doesAttachOption(contents[2])) {
    return contents[2].slice(2, contents[2].length);
  }
  return (+count || +contents[3] || 10);
}

const organizeInputs = function (inputs) {
  let action = extractAction(inputs);
  let actionSign = ["-", "n", "c"];
  let filesName = (files = extractFileContents(inputs));
  let count = actionSign.reduce(removeCharacter, inputs[2]);
  count = correctCount(inputs, count);
  return { action, count, files, filesName };
};

exports.head = head;
exports.tail = tail;
exports.extractFileContents = extractFileContents;
exports.organizeInputs = organizeInputs;
exports.readFile = readFile;
exports.readUserInputs = readUserInputs;