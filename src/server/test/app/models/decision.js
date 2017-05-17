'use strict';

var expect = require('chai').expect;

var decision = require('../../../app/models/decision');

describe('decision', function() {
  it('should load', function() {
    expect(decision).to.be.a('function');
  });
});
