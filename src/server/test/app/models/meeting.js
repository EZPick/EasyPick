'use strict';

var expect = require('chai').expect;

var meeting = require('../../../app/models/meeting');

describe('meeting', function() {
  it('should load', function() {
    expect(meeting).to.be.a('function');
  });
});
