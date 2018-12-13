const { readFileSync, existsSync }  = require('fs');
const { tail, readUserInputs } = require('./src/lib.js');

const main = function(){
  console.log( tail( readUserInputs( process.argv, readFileSync, existsSync ) ) );
}

main();
