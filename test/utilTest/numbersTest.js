const {
    isNotZero,
    isNatural
} = require('../../src/util/numbers.js');

const assert = require('assert');

describe('isNotZero', function () {

    it('should return true for non-zero value', function () {
        assert.deepEqual(isNotZero(1), true);
    });

    it('should return false for zero', function () {
        assert.deepEqual(isNotZero(0), false);
    });
});

describe('isNatural', function () {

    it('should return true for Natural number', function () {
        assert.deepEqual(isNatural(1), true);
    });

    it('should return true for non-natural number', function () {
        assert.deepEqual(isNatural(0), false);
    });
});