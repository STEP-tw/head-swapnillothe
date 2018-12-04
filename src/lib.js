const getNHeadLines = function( n, text ){
  let head = text.split('\n').filter( ( x, y ) => y < n );
  return head.join('\n');
}

const getFirstNCharacters = function( n, text ){
  return text.slice( 0, n );
}

exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
