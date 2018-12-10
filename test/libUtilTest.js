const { deepEqual } = require('assert');
const {
    identity
} = require('../src/libUtil');

describe("identity", function () {
    it("should return same as given", function () {
        deepEqual(identity("x"), "x");
    });
});