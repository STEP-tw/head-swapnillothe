const { deepEqual } = require( 'assert' );
const { getNHeadLines, getFirstNCharacters } = require( '../src/lib.js' );

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
    deepEqual( getFirstNCharacters( 2, "abc" ), "ab" );
  });
});
