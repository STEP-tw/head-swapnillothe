const getNHeadLines = function( n, text ){
  let head = text.split('\n').filter( ( x, y ) => y < n );
  return head.join('\n');
}

const getFirstNCharacters = function( n, text ){
  return text.slice( 0, n );
}

const head = function( { action, files, headLineNumbers, filesName } ){
  let headFunc = action.bind( null, headLineNumbers );
  let requiredHead = files.map( headFunc );
  if( filesName.length > 1 ){ requiredHead = zipDataSets( filesName.map( formatText ), requiredHead ) };
  return requiredHead.join("\n");
}

const removeCharacter = function( text, character ){
  return text.split('').filter( x => x!=character ).join('');
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

const identity = function( data ){
  return data;
}

const formatText = function( text ){
  return `==> ${text} <==\n`;
}

const zipDataSets = function( set1, set2 ){
  let index = 0;
  return set1.map( element => element + set2[ index++ ] );
}

const readFile = function( reader, file ){
  return reader( file, "utf8" );
}

const readUserInputs = function( inputs, read = identity ){
  let { action, files, headLineNumbers } = organizeInputs( inputs );
  let filesName = extractFileContents( inputs );
  files = extractFileContents( inputs ).map( readFile.bind( null, read ) );
  return { action, headLineNumbers, files, filesName };
}

const organizeInputs = function( inputs, read = identity ){
  let action = getNHeadLines;
  let actionSign = [ "-", "n", "c" ];
  let filesName = extractFileContents( inputs );

  if( inputs.some( x => x.match( "-c" ) ) ){
    action = getFirstNCharacters;
  }

  let headLineNumbers = +( actionSign.reduce( removeCharacter, inputs[2] ) );
  headLineNumbers = headLineNumbers || +inputs[ 3 ] || 10;
  let files = read( filesName );
  return { action, headLineNumbers, files };
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
