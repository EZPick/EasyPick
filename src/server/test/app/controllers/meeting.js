'use strict';

var expect = require('chai').expect;

var meeting = require('../../../app/controllers/meeting');

describe('meeting routes', function() {
  it('should load', function() {
    expect(meeting).to.be.a('function');
  });
});
