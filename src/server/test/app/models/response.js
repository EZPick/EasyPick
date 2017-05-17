'use strict';

var expect = require('chai').expect;

var Meeting = require('../../../app/models/Response');

describe('Response', function() {
  it('should load', function() {
    expect(Response).to.be.a('function');
  });
});
