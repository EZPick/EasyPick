'use strict';

var expect = require('chai').expect;

var Meeting = require('../../../app/models/meeting');

describe('Meeting', function() {
  it('should load', function() {
    expect(Meeting).to.be.a('function');
  });
});
