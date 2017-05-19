'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

var express = require('express');

var meeting = require('../../../app/controllers/meeting');

describe('meeting controller', function() {
  it('should load', function() {
    expect(meeting).to.be.a('function');
  });

  describe('routes', function() {
    var app;

    beforeEach(function() {
      app = express();
      process.env.NODE_ENV = 'production';
      meeting(app);
    });

    it('should respond to /meeting/create', function(done) {
      chai.request(app)
        .post('/meeting/create')
        // Pass parameters here
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);
          done();
        });
    });

    it('should respond to /meeting/1', function(done) {
      chai.request(app)
        .get('/meeting/1')
        // Pass parameters here
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);
          done();
        });
    });
  });
});
