const { readFileSync, existsSync }  = require('fs');
const { head, readUserInputs } = require('./src/lib.js');

const main = function(){
  console.log( head( readUserInputs( process.argv, readFileSync, existsSync ) ) );
}

main();
