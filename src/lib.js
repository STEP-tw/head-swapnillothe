const identity = function( data ){
  return data;
}

const formatText = function( text ){
  return `==> ${text} <==`;
}

const readFile = function( reader, doesFileExist , file ){
  if( reader != identity && !(doesFileExist(file) ) ){
    return `head: ${file}: No such file or directory`
  }
  return reader( file, "utf8" );
}

const getFirstNCharacters = function( n, text ){
  return text.slice( 0, n );
}

const removeCharacter = function( text, character ){
  return text.split('').filter( x => x!=character ).join('');
}

const getNHeadLines = function( n, text ){
  let head = text.split('\n').filter( ( x, y ) => y < n );
  return head.join('\n');
}

const zipDataSets = function( set1, set2 ){
  let index = 0;
  return set1.map( element => element + set2[ index++ ] );
}

const insertHeaders = function( texts, headers ){
  texts = texts.map( text => "\n" + text );
  return zipDataSets( headers.map( formatText ), texts ); 
}

const head = function( { action, files, headLineNumbers, filesName } ){
  if( +headLineNumbers < 1 ){
    return `head: illegal line count -- ${ headLineNumbers }`;
  }
  let headFunc = action.bind( null, headLineNumbers );
  let requiredHead = files.map( headFunc );
  if( files.length > 1 ){
    requiredHead = insertHeaders( requiredHead, filesName );
  }
  return requiredHead.join("\n\n");
}

const readUserInputs = function( inputs, read = identity, fileExistenceChecker ){
  let { action, files, headLineNumbers, filesName } = organizeInputs( inputs );
  files = filesName.map( readFile.bind( null, read, fileExistenceChecker ) );
  return { action, headLineNumbers, files, filesName };
}

const extractFileContents = function( dataContents ){
  if( dataContents[ 2 ][ 0 ] != "-" ){
    return dataContents.slice( 2, dataContents.length );
  }
  if( +dataContents[ 3 ]){
    return dataContents.slice( 4, dataContents.length );
  }
  return dataContents.slice( 3, dataContents.length );
}

const organizeInputs = function( inputs ){
  let action = getNHeadLines;
  let actionSign = [ "-", "n", "c" ];

  if( inputs.some( x => x.match( "-c" ) ) ){
    action = getFirstNCharacters;
  }

  let files = extractFileContents( inputs );
  let filesName = files;
  let headLineNumbers = ( actionSign.reduce( removeCharacter, inputs[2] ) );
  if( headLineNumbers < 1 && headLineNumbers != ''){
    return { action, headLineNumbers, files, filesName }
  };
  headLineNumbers = +headLineNumbers || +inputs[ 3 ] || 10;
  return { action, headLineNumbers, files, filesName };
}

exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
exports.head = head;
exports.removeCharacter = removeCharacter;
exports.extractFileContents = extractFileContents;
exports.organizeInputs = organizeInputs;
exports.identity = identity;
exports.readFile = readFile;
exports.readUserInputs = readUserInputs;
exports.zipDataSets = zipDataSets;
exports.formatText = formatText;
exports.insertHeaders = insertHeaders;
