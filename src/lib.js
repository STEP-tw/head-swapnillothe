const identifyAction = function( sign ){
  let action = "getNHeadLines";
  if( sign.match("-c") ){
    action = "getFirstNCharacters";
  };
  return action 
}

<<<<<<< HEAD
console.log( identifyAction("-c"),"getFirstNCharacters");
=======
const getFirstNCharacters = function( n, text ){
  return text.slice( 0, n );
}

exports.getFirstNCharacters = getFirstNCharacters;
exports.getNHeadLines = getNHeadLines;
>>>>>>> parent of ceb1b6b... Introduce a head function with test.
