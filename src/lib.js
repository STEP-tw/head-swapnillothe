const identifyAction = function( sign ){
  let action = "getNHeadLines";
  if( sign.match("-c") ){
    action = "getFirstNCharacters";
  };
  return action 
}

console.log( identifyAction("-c"),"getFirstNCharacters");
