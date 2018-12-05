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

const readUserInputs = function( inputs ){
  let action = getNHeadLines;
  let actionSign = [ "-", "n", "c" ];

  if( inputs.some( x => x.match( "-c" ) ) ){
    action = getFirstNCharacters;
  }

  let headLineNumbers = +( actionSign.reduce( removeCharacter, inputs[2] ) );
  headLineNumbers = headLineNumbers || +inputs[ 3 ] || 10;
  let files = extractFileContents( inputs );
  return { action, headLineNumbers, files };
}

exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
exports.head = head;
exports.removeCharacter = removeCharacter;
exports.extractFileContents = extractFileContents;
exports.readUserInputs = readUserInputs;
exports.identity = identity;
