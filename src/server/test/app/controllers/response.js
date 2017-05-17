'use strict';

var expect = require('chai').expect;

var response = require('../../../app/controllers/response');

describe('response routes', function() {
  it('should load', function() {
    expect(response).to.be.a('function');
  });
});
