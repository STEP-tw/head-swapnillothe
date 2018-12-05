const getNHeadLines = function( n, text ){
  let head = text.split('\n').filter( ( x, y ) => y < n );
  return head.join('\n');
}

const getFirstNCharacters = function( n, text ){
  return text.slice( 0, n );
}

const head = function( { action, files, headLineNumbers } ){
  let headFunc = action.bind( null, headLineNumbers );
  let requiredHead = files.map( headFunc );
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

const zipDataSets = function( set1, set2 ){
  let zippedDataSet = [];
  for( let index = 0; index < set1.length; index++){
    zippedDataSet.push( set1[ index ] + set2[ index ] );
  }
  return zippedDataSet;
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

  if( inputs.some( x => x.match( "-c" ) ) ){
    action = getFirstNCharacters;
  }

  let headLineNumbers = +( actionSign.reduce( removeCharacter, inputs[2] ) );
  headLineNumbers = headLineNumbers || +inputs[ 3 ] || 10;
  let files = read( extractFileContents( inputs ) );
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
