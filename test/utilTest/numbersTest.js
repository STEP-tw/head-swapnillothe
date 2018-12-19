const {
    isNotZero,
    isNotNatural
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

describe('isNotNatural', function () {

    it('should return true for Natural number', function () {
        assert.deepEqual(isNotNatural(1), false);
    });

    it('should return false for non-natural number', function () {
        assert.deepEqual(isNotNatural(0), true);
    });
});