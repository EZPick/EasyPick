'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

var express = require('express');
var bodyParser = require('body-parser');

var mockery = require('mockery');
var sinon = require('sinon');
var findOneStub = sinon.stub();
var createStub = sinon.stub();

mockery.registerMock('../models', {
  Meeting: {
    findOne: findOneStub,
    create: createStub
  }
});
mockery.enable({
  warnOnUnregistered: false
});
var meeting = require('../../../app/controllers/meeting');
mockery.disable();

describe('meeting controller', function() {
  it('should load', function() {
    expect(meeting).to.be.a('function');
  });

  describe('routes', function() {
    var app;

    beforeEach(function() {
      findOneStub.resetHistory();

      app = express();
      app.use(bodyParser.json());
      process.env.NODE_ENV = 'production';
      meeting(app);
    });

    describe('/meeting/create', function() {
      it('should 200 when create succeeds', function(done) {
        createStub.returns(
          Promise.resolve({
            dataValues: {
              id: 1,
              title: 'Title'
            }
          })
        );
        chai.request(app)
          .post('/meeting/create')
          .send({
            title: 'Title',
            closeoutTime: new Date(),
            generalLocationLatitude: 47,
            generalLocationLongitude: -122,
            radius: 1000,
            duration: 60,
            invited: ['email1', 'email2'],
            creator: 'me'
          })
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res).to.have.status(200);
            expect(createStub.calledOnce).to.equal(true);
            done();
          });
      });

      it('should 500 and not call db with missing params', function(done) {
        createStub.returns(
          Promise.reject()
        );
        chai.request(app)
          .post('/meeting/create')
          // Pass parameters here
          .end(function(err, res) {
            expect(err).to.exist;
            expect(res).to.have.status(500);
            expect(createStub.calledOnce).to.equal(false);
            done();
          });
      });

      it('should 500 and call db with bad params', function(done) {
        createStub.returns(
          Promise.reject()
        );
        chai.request(app)
          .post('/meeting/create')
          .send({
            title: 'Title',
            closeoutTime: new Date(),
            generalLocationLatitude: 47,
            generalLocationLongitude: -122,
            radius: 1000,
            duration: 60,
            invited: ['email1', 'email2'],
            creator: 'me'
          })
          .end(function(err, res) {
            expect(err).to.exist;
            expect(res).to.have.status(500);
            expect(createStub.calledOnce).to.equal(false);
            done();
          });
      });
    });

    describe('/meeting/:id', function() {
      it('should 200 when meeting exists', function(done) {
        findOneStub.returns(
          Promise.resolve({
            dataValues: {
              id: 1,
              title: 'Title'
            }
          })
        );
        chai.request(app)
          .get('/meeting/1')
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res).to.have.status(200);
            expect(findOneStub.calledOnce).to.equal(true);
            done();
          });
      });

      it('should 404 when meeting doesn\'t exist', function(done) {
        findOneStub.returns(Promise.reject());
        chai.request(app)
          .get('/meeting/1')
          .end(function(err, res) {
            expect(err).to.exist;
            expect(res).to.have.status(404);
            expect(findOneStub.calledOnce).to.equal(true);
            done();
          });
      });
    });
  });
});
