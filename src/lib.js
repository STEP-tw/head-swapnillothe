const getNHeadLines = function( text, n ){
  let head = text.split('\n').filter( ( x, y ) => y < n );
  return head.join('\n');
}

const getFirstNCharacters = function( text, n ){
  return text.slice( 0, n );
}

exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
