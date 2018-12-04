const { deepEqual } = require( 'assert' );
const { getNHeadLines } = require( '../src/lib.js' );

describe("getNHeadLines",function() {
  it("should work for no line",function() {
    deepEqual( getNHeadLines( '', 0 ), '' );
  });
  it("should work for single line",function() {
    deepEqual( getNHeadLines( 'a', 1 ), 'a' );
  });
  it("should work for multiple lines",function() {
    deepEqual( getNHeadLines( 'a\nb\nc', 2 ), 'a\nb' );
  });
  it("should work for less no of lines with more requirment of no of lines",function() {
    deepEqual( getNHeadLines( 'a\nb\nc', 5 ), 'a\nb\nc' );
  });
});
