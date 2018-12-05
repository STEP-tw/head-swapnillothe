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

exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
exports.head = head;
exports.removeCharacter = removeCharacter;
