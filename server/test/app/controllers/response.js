'use strict';
var bodyParser = require('body-parser');
var express = require('express');

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

var mockery = require('mockery');
var sinon = require('sinon');

var responseCreateStub = sinon.stub().returns(Promise.resolve());

mockery.registerMock('../models', {
  Response: {
    create: responseCreateStub
  }
});

mockery.enable({
  warnOnUnregistered: false
});
var response = require('../../../app/controllers/response');
mockery.disable();

describe('response routes', function() {
  beforeEach(function() {
    responseCreateStub.resetHistory();
  });

  it('should load', function() {
    expect(response).to.be.a('function');
  });

  describe('create', function() {
    var app;

    beforeEach(function() {
      app = express();
      app.use(bodyParser.json());
      response(app);
    });

    it('should succeed when everything is supplied', function(done) {
      chai.request(app)
        .post('/api/response/create')
        .send({
          name: 'Meeting Name',
          email: 'fake@email.com',
          schedule: JSON.stringify([{300: true, 900: true}, {}, {1200: true}]),
          locationPreferences: JSON.stringify({wifi: true, foodAndDrink: true}),
          MeetingId: 1
        })
        .end(function(err, res) {
          expect(err).to.not.exist;
          expect(res).to.have.status(200);
          expect(responseCreateStub.calledOnce).to.equal(true);
          done();
        });
    });

    it('should fail when schedule is invalid', function(done) {
      chai.request(app)
        .post('/api/response/create')
        .send({
          name: 'Meeting Name',
          email: 'fake@email.com',
          schedule: 'not jason',
          locationPreferences: JSON.stringify({wifi: true, foodAndDrink: true}),
          MeetingId: 1
        })
        .end(function(err, res) {
          expect(err).to.exist;
          expect(res).to.have.status(500);
          expect(responseCreateStub.calledOnce).to.equal(false);
          done();
        });
    });

    it('should fail when locationPreferences is invalid', function(done) {
      chai.request(app)
        .post('/api/response/create')
        .send({
          name: 'Meeting Name',
          email: 'fake@email.com',
          schedule: JSON.stringify([{300: true, 900: true}, {}, {1200: true}]),
          locationPreferences: 'not jason',
          MeetingId: 1
        })
        .end(function(err, res) {
          expect(err).to.exist;
          expect(res).to.have.status(500);
          expect(responseCreateStub.calledOnce).to.equal(false);
          done();
        });
    });
  });
});
