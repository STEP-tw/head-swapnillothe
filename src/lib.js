const {
  identity,
  getFirstNCharacters,
  getNHeadLines,
  insertHeaders,
  applyAction,
  getLastNCharacters,
  getNTailLines,
  doesNeedHeaders,
} = require('./util/libUtil');

const {
  getIfHeadError,
  getIfTailError
} = require('./handleError.js');

const {
  isNatural
} = require('../src/util/numbers.js');

const {
  parseInput
} = require('../src/parseInput.js');

const readFile = function (reader, doesFileExist, title, file) {
  if (reader != identity && !doesFileExist(file)) {
    return `${title}: ${file}: No such file or directory`;
  }
  return reader(file, "utf8");
};

const readUserInputs = function (inputs, read = identity, fileExistenceChecker) {
  let { command, option, count, fileNames } = parseInput(inputs);
  let action = getAction(command, option);
  let files = fileNames.map(readFile.bind(null, read, fileExistenceChecker, command));
  return { action, count, files, fileNames, fileExistenceChecker };
};

const getAction = function (command, option) {
  const action = {
    'head': { 'n': getNHeadLines, 'c': getFirstNCharacters },
    'tail': { 'n': getNTailLines, 'c': getLastNCharacters }
  }
  return action[command][option];
}

const tail = function ({
  action,
  files,
  count,
  fileNames,
  fileExistenceChecker
}) {
  let requiredTail = applyAction(
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
  let requiredHead = applyAction(action,
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

module.exports = {
  head,
  tail,
  readFile,
  readUserInputs,
  getAction
};