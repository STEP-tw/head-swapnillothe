const {
  identity,
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
  extractCommand,
  recorrectCount
} = require('./util/libUtil');

const {
  removeCharacter,
  sliceFrom
} = require('./util/string.js');

const {
  getIfHeadError,
  getIfTailError
} = require('./handleError.js');

const {
  isNatural,
} = require('../src/util/numbers.js');

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
  fileNames,
  fileExistenceChecker
}) {
  let requiredTail = applyActionIfExist(
    action,
    count,
    files,
    fileNames,
    fileExistenceChecker
  );

  const error = getIfTailError({ count, action, fileNames });

  if (error) { return error };
  if (!isNatural(+count)) {
    requiredTail = files.map(() => '');
  }
  if (doesNeedHeaders(files)) {
    requiredTail = insertHeaders(requiredTail, fileNames, fileExistenceChecker);
  }
  return requiredTail.join('\n');
}

const head = function ({
  action,
  files,
  count,
  fileNames,
  fileExistenceChecker
}) {
  let requiredHead = applyActionIfExist(action,
    count,
    files,
    fileNames,
    fileExistenceChecker
  );

  let error = getIfHeadError({ count, action, fileNames });
  if (error) { return error };
  if (doesNeedHeaders(files)) {
    requiredHead = insertHeaders(requiredHead, fileNames, fileExistenceChecker);
  }
  return requiredHead.join("\n");
};

const readUserInputs = function (inputs, read = identity, fileExistenceChecker) {
  let { action, count, fileNames } = organizeInputs(inputs);
  let command = extractCommand(inputs[1]);
  let files = fileNames.map(readFile.bind(null, read, fileExistenceChecker, command));
  return { action, count, files, fileNames, fileExistenceChecker };
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
    return contents[3];
  }
  if (doesAttachOption(contents[2])) {
    return sliceFrom(contents[2], 2);
  }
  return recorrectCount(contents, count);
}

const organizeInputs = function (inputs) {
  let action = extractAction(inputs);
  let actionSign = ["-", "n", "c"];
  let fileNames = extractFileContents(inputs);
  let count = actionSign.reduce(removeCharacter, inputs[2]);
  count = correctCount(inputs, count);
  return { action, count, fileNames };
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