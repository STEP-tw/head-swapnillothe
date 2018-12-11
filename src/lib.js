const {
  identity,
  removeCharacter,
  getFirstNCharacters,
  getNHeadLines,
  insertHeaders,
  applyActionIfExist,
  getLastNCharacters,
  getNTailLines
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

  let requiredTail = applyActionIfExist(
    action,
    count,
    files,
    filesName,
    fileExistenceChecker
  );
  const isNotZero = number => number != 0;
  if (
    (+count < 1 || isNaN(+count)) &&
    action == getNTailLines
  ) {
    requiredTail = files.map(files => '');
    if (isNotZero(count)) {
      return `tail: illegal offset -- ${count}`;
    }
  }

  if (count == "error" && action == getLastNCharacters) {
    return `tail: illegal offset -- ${filesName[0]}`;
  }

  if (isNaN(+count) && action == getLastNCharacters) {
    return `tail: illegal offset -- ${count}`;
  }

  if (files.length > 1) {
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
  let requiredHead = applyActionIfExist(
    action,
    count,
    files,
    filesName,
    fileExistenceChecker
  );

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
  if (files.length > 1) {
    requiredHead = insertHeaders(requiredHead, filesName, fileExistenceChecker);
  }
  return requiredHead.join("\n");
};

const readUserInputs = function (inputs, read = identity, fileExistenceChecker) {
  let { action, files, count, filesName } = organizeInputs(inputs);
  let title = 'head';
  if (inputs[1].includes('tail.js')) { title = 'tail' }
  files = filesName.map(readFile.bind(null, read, fileExistenceChecker, title));
  return { action, count, files, filesName, fileExistenceChecker };
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
  let count = actionSign.reduce(removeCharacter, inputs[2]);

  if (inputs.some(x => x.match("-c"))) {
    action = getFirstNCharacters;
  }

  if (inputs[2] == "-c" && isNaN(inputs[3])) {
    count = "error";
    return { action, count, files, filesName };
  }

  if (
    (inputs[2].includes("-c") || inputs[2].includes("-n")) &&
    inputs[2].length != 2
  ) {
    count = inputs[2].slice(2, inputs[2].length);
    return { action, count, files, filesName };
  }

  if (count < 1 && count != "") {
    if (inputs[1] == 'head.js')
      return { action, count, files, filesName };
  }

  count = +count || +inputs[3] || 10;
  return { action, count, files, filesName };
};

exports.head = head;
exports.tail = tail;
exports.extractFileContents = extractFileContents;
exports.organizeInputs = organizeInputs;
exports.readFile = readFile;
exports.readUserInputs = readUserInputs;