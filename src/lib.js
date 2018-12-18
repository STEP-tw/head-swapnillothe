const {
  identity,
  removeCharacter,
  getFirstNCharacters,
  getNHeadLines,
  insertHeaders,
  applyActionIfExist,
  getLastNCharacters,
  getNTailLines,
  doesContainC,
  isCountInvalid,
  doesAttachOption,
  doesNeedHeaders,
  isNotNatural,
  sliceFrom,
  extractCommand,
  recorrectCount
} = require('./libUtil.js');

const {
  getIfHeadError,
  getIfTailError
} = require('./handleError.js');

const readFile = function (reader, doesFileExist, title, file) {
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
  let requiredTail = applyActionIfExist(
    action,
    count,
    files,
    filesName,
    fileExistenceChecker
  );

  const error = getIfTailError({ count, action, filesName });

  if (error) { return error };
  if (isNotNatural(+count)) {
    requiredTail = files.map(() => '');
  }
  if (doesNeedHeaders(files)) {
    requiredTail = insertHeaders(requiredTail, filesName, fileExistenceChecker);
  }
  return requiredTail.join('\n');
}

const head = function ({
  action,
  files,
  count,
  filesName,
  fileExistenceChecker
}) {
  let requiredHead = applyActionIfExist(action,
    count,
    files,
    filesName,
    fileExistenceChecker
  );

  let error = getIfHeadError({ count, action, filesName });
  if (error) { return error };
  if (doesNeedHeaders(files)) {
    requiredHead = insertHeaders(requiredHead, filesName, fileExistenceChecker);
  }
  return requiredHead.join("\n");
};

const readUserInputs = function (inputs, read = identity, fileExistenceChecker) {
  let { action, files, count, filesName } = organizeInputs(inputs);
  let command = extractCommand(inputs[1]);
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
  let command = extractCommand(contents[1]);
  const action = {
    'head': { 'n': getNHeadLines, 'c': getFirstNCharacters },
    'tail': { 'n': getNTailLines, 'c': getLastNCharacters }
  }
  if (doesContainC(contents)) {
    return action[command]['c'];
  }
  return action[command]['n'];
}

const correctCount = function (contents, count) {
  if (isCountInvalid(contents)) {
    return "error";
  }
  if (doesAttachOption(contents[2])) {
    return sliceFrom(contents[2], 2);
  }
  return recorrectCount(contents, count);
}

const organizeInputs = function (inputs) {
  let action = extractAction(inputs);
  let actionSign = ["-", "n", "c"];
  let filesName = (files = extractFileContents(inputs));
  let count = actionSign.reduce(removeCharacter, inputs[2]);
  count = correctCount(inputs, count);
  return { action, count, files, filesName };
};

module.exports = {
  head,
  tail,
  extractFileContents,
  organizeInputs,
  readFile,
  readUserInputs,
  extractAction
};