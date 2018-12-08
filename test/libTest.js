const { deepEqual } = require( 'assert' );
const { 
  getNHeadLines,
  getFirstNCharacters,
  head,
  removeCharacter,
  extractFileContents,
  organizeInputs,
  identity,
  readFile,
  readUserInputs,
  zipDataSets,
  formatText,
  insertHeaders
} = require( '../src/lib.js' );

describe("getNHeadLines",function() {
  it("should work for no line",function() {
    deepEqual( getNHeadLines( 0, '' ), '' );
  });
  it("should work for single line",function() {
    deepEqual( getNHeadLines( 1, 'a' ), 'a' );
  });
  it("should work for multiple lines",function() {
    deepEqual( getNHeadLines(  2, 'a\nb\nc',), 'a\nb' );
  });
  it("should work for less no of lines with more requirment of no of lines",function() {
    deepEqual( getNHeadLines( 5, 'a\nb\nc'), 'a\nb\nc' );
  });
});

describe("getFirstNCharacters",function() {
  it("should work for single line",function() {
    deepEqual( getFirstNCharacters( 2, "abc" ), "ab" );
  });
  it("should work for multiple lines",function() {
    deepEqual( getFirstNCharacters( 2, "abc\nabc" ), "ab" );
    deepEqual( getFirstNCharacters( 5, "abc\nabc" ), "abc\na" );
  });
  it("should return empty string for zero character requirement",function() {
    deepEqual( getFirstNCharacters( 0, "abc" ), "" );
  });
});

describe("head",function() {
  it("should work for single file",function() {
    deepEqual( head( { action : getNHeadLines, files : [ "abc" ], headLineNumbers : 1, filesName : [ "abc" ] } ), "abc" );
  });
  it("should work for multiple files",function() {
    deepEqual( head( { action : getNHeadLines, files : [ "abc\nabc\nabc", "cba" ], filesName : [ "abc\nabc\nabc", "cba" ], headLineNumbers : 1 } ), "==> abc\nabc\nabc <==\nabc\nabc\nabc\n==> cba <==\ncba" );
  });
  it("should return 0 as an illegal line count",function() {
    deepEqual( head( { action : getNHeadLines, files : [ "abc" ], headLineNumbers : 0, filesName : [ "abc" ] } ), "head: illegal line count -- 0" );
  });
  it("should list the contents of the entire file if argument is greater than number of lines in file",function() {
    deepEqual( head( { action : getNHeadLines, files : [ "abc\ndef\nghi" ], headLineNumbers : 2, filesName : [ "abc\ndef\nghi" ] } ), "abc\ndef\nghi" );
  });
  it("should handle byte count option",function() {
    deepEqual( head( { action : getNHeadLines, files : [ "abc\ndef\nghi" ], headLineNumbers : '', filesName : [ "abc\ndef\nghi" ] } ), "head: illegal line count -- " );
  });
});

describe("removeCharacters",function() {
  it("should work",function() {
    deepEqual( removeCharacter( "abcdefghi", "a" ), "bcdefghi" );
    deepEqual( removeCharacter( "abcd\nefghi", "b" ), "acd\nefghi" );
  });
});

describe("extractFileContents",function() {
  it("should work for two args before file contents",function() {
    deepEqual( extractFileContents( [ ,, "-n", "3", "abc" ]), [ "abc" ]);
  });
  it("should work for one arg before file contents",function() {
    deepEqual( extractFileContents( [ ,, "-n3", "abc" ]), [ "abc" ]);
  });
  it("should work for no args before file contents",function() {
    deepEqual( extractFileContents( [ ,, "abc" ]), [ "abc" ]);
  });
});

describe("formatText",function() {
  it("should format text like this ==> text <==\n\n",function() {
    deepEqual( formatText( "abcd" ),"==> abcd <==" );
  });
});

describe("insertHeaders",function() {
  it("should work for single text and header",function() {
    deepEqual( insertHeaders( [ "text1" ], [ "header1" ] ), [ '==> header1 <==\ntext1' ] );
  });
  it("should work for multiple texts and headers",function() {
    deepEqual( insertHeaders( [ "text1", "text2" ], [ "header1", "header2" ] ), [ '==> header1 <==\ntext1', '==> header2 <==\ntext2' ] );
  });
});

describe("identity",function() {
  it("should work",function() {
    deepEqual( identity( "x" ), "x" );
  });
});

describe("readFile",function() {
  it("should read the text with given reader",function() {
    deepEqual( readFile( identity, undefined, "abc"), "abc" );
  });
});

describe("readUserInputs",function() {

  describe( "with getNHeadLines default function", function(){
    it("should work for two arguments before file contents", function() {
      deepEqual( readUserInputs( [,,"-n", "3", "abc" ] ), { action : getNHeadLines, headLineNumbers : 3,filesName: [ 'abc'], files : [ "abc" ], fileExistenceChecker: undefined } );
    });
    it("should work for one arguments before file contents",function() {
      deepEqual( readUserInputs( [,,"-n3", "abc" ] ), { action : getNHeadLines, headLineNumbers : 3, filesName: [ 'abc'],files : [ "abc" ], fileExistenceChecker: undefined } );
    });
    it("should work for no argument before file contents",function() {
      deepEqual( readUserInputs( [,, "abc" ] ), { action : getNHeadLines, headLineNumbers : 10, filesName: [ 'abc'],files : [ "abc" ], fileExistenceChecker: undefined } );
    });
  });

  describe( "with getFirstNCharacters function", function(){
    it("should work for two arguments before file contents", function() {
      deepEqual( readUserInputs( [,,"-c", "3", "abc" ] ), { action : getFirstNCharacters, headLineNumbers : 3, filesName: [ 'abc'],files : [ "abc" ], fileExistenceChecker: undefined } );
    });
    it("should work for one arguments before file contents",function() {
      deepEqual( readUserInputs( [,,"-c3", "abc" ] ), { action : getFirstNCharacters, headLineNumbers : 3, filesName: [ 'abc'],files : [ "abc" ], fileExistenceChecker: undefined } );
    });
  });
});


describe("organizeInputs",function() {

  describe( "with getNHeadLines default function", function(){
    it("should work for two arguments before file contents", function() {
      deepEqual( organizeInputs( [,,"-n", "3", "abc" ] ), { action : getNHeadLines, headLineNumbers : 3, files : [ "abc" ], filesName : [ "abc" ] } );
    });
    it("should work for one arguments before file contents",function() {
      deepEqual( organizeInputs( [,,"-n3", "abc" ] ), { action : getNHeadLines, headLineNumbers : 3, files : [ "abc" ], filesName : [ "abc" ] } );
    });
    it("should work for no argument before file contents",function() {
      deepEqual( organizeInputs( [,, "abc" ] ), { action : getNHeadLines, headLineNumbers : 10, files : [ "abc" ], filesName : [ "abc" ] } );
    });
    it("should parse arguments with a space in betwen -n and the number",function() {
      deepEqual( organizeInputs( [ ,,"-n","3","abc" ]), { action : getNHeadLines, headLineNumbers : 3, files : [ "abc" ], filesName : [ "abc" ] } );
    });
    it("should parse arguments with a space in betwen -c and the number",function() {
      deepEqual( organizeInputs( [ ,,"-c","3","abc" ]), { action : getFirstNCharacters, headLineNumbers : 3, files : [ "abc" ], filesName : [ "abc" ] } );
    });
  });

  describe( "with getFirstNCharacters function", function(){
    it("should work for two arguments before file contents", function() {
      deepEqual( organizeInputs( [,,"-c", "3", "abc" ] ), { action : getFirstNCharacters, headLineNumbers : 3, files : [ "abc" ], filesName : [ "abc" ] } );
    });
    it("should work for one arguments before file contents",function() {
      deepEqual( organizeInputs( [,,"-c3", "abc" ] ), { action : getFirstNCharacters, headLineNumbers : 3, files : [ "abc" ], filesName : [ "abc" ] } );
    });
  });
  describe("with other general tests",function() {
    it("should handle default argument as getNHeadLines for action",function() {
      deepEqual( organizeInputs( [,, "abc" ] ), { action : getNHeadLines, headLineNumbers : 10, files : [ "abc"     ], filesName : [ "abc" ] } );
    });
    it("should show an error for invalid headLineNumbers",function() {
      deepEqual( organizeInputs( [,,"-c", "abc" ] ), { action : getFirstNCharacters, headLineNumbers : 'error', files : [ "abc"     ], filesName : [ "abc" ] } );
    });
  });
});

