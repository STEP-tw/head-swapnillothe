const getNHeadLines = function( text, numberOfLines ){
  let head = text.split('\n').filter( ( x, y ) => y < numberOfLines ).join('\n');
  return head;
}

exports.getNHeadLines = getNHeadLines;
