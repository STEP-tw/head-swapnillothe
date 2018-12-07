const identity = function( data ){
  return data;
}

const formatText = function( text ){
  return `==> ${text} <==`;
}

const readFile = function( reader, doesFileExist , file ){
  if( reader != identity && !(doesFileExist(file) ) ){
    return `head: ${file}: No such file or directory`
  }
  return reader( file, "utf8" );
}

const getFirstNCharacters = function( n, text ){
  return text.slice( 0, n );
}

const removeCharacter = function( text, character ){
  return text.split('').filter( x => x!=character ).join('');
}

const getNHeadLines = function( n, text ){
  let head = text.split('\n').filter( ( x, y ) => y < n );
  return head.join('\n');
}

const zipDataSets = function( set1, set2 ){
  let index = 0;
  return set1.map( element => element + set2[ index++ ] );
}

const insertHeaders = function( texts, headers, isEligible = identity ){
  let insertedHeaders = [];
  for( let index = 0; index < texts.length; index++){
    insertedHeaders[ index ] = texts[ index ];
    if( isEligible( headers[ index ] )){
      insertedHeaders[ index ] = formatText( headers[ index ] ) + 
        '\n' + texts[ index ];
    }
  }
  return insertedHeaders;
}

const head = function( { action, files, headLineNumbers, filesName, fileExistenceChecker } ){
  let headFunc = action.bind( null, headLineNumbers );
  for ( let index = 0; index < files.length; index++){
    if( fileExistenceChecker && fileExistenceChecker( filesName[ index ]) ){
      files[ index ] = formatText( filesName[ index ] ) + '\n' + headFunc( files[ index ] );
    }
  }

  if( (+headLineNumbers < 1 || isNaN( +headLineNumbers )) && action==getNHeadLines ){
    return `head: illegal line count -- ${ headLineNumbers }`;
  }
  if( ( isNaN( +headLineNumbers )) && action==getFirstNCharacters ){
    return `head: illegal byte count -- ${ headLineNumbers }`;
  }
  return files.join("\n");
}

const readUserInputs = function( inputs, read = identity, fileExistenceChecker ){
  let { action, files, headLineNumbers, filesName } = organizeInputs( inputs );
  files = filesName.map( readFile.bind( null, read, fileExistenceChecker ) );
  return { action, headLineNumbers, files, filesName, fileExistenceChecker };
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

const organizeInputs = function( inputs ){
  let action = getNHeadLines;
  let actionSign = [ "-", "n", "c" ];
  let filesName = files = extractFileContents( inputs );
  let headLineNumbers = ( actionSign.reduce( removeCharacter, inputs[2] ) );
  
  if( inputs.some( x => x.match( "-c" ) ) ){
    action = getFirstNCharacters;
  }

  if( (inputs[2].includes('-c') || inputs[2].includes('-n')) && inputs[2].length != 2 ){
    headLineNumbers = inputs[ 2 ].slice( 2, inputs[ 2 ].length );
    return { action, headLineNumbers, files, filesName };
  };

  if( headLineNumbers < 1 && headLineNumbers != ''){
    return { action, headLineNumbers, files, filesName }
  };

  headLineNumbers = +headLineNumbers || +inputs[ 3 ] || 10;
  return { action, headLineNumbers, files, filesName };
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
exports.formatText = formatText;
exports.insertHeaders = insertHeaders;
