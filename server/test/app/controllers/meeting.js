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
var saveStub = sinon.stub();
var createStub = sinon.stub();
var sendMailStub = sinon.stub().returns(Promise.resolve());

mockery.registerMock('../models', {
  Meeting: {
    findOne: findOneStub,
    create: createStub
  }
});

mockery.registerMock('nodemailer', {
  createTransport: function() {
    return {
      templateSender: function() {
        return sendMailStub;
      }
    };
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
      createStub.resetHistory();
      findOneStub.resetHistory();
      sendMailStub.resetHistory();
      saveStub.resetHistory();

      app = express();
      app.use(bodyParser.json());
      process.env.NODE_ENV = 'production';
      meeting(app);
    });

    describe('/meeting/create', function() {
      it('should 200 when create succeeds', function(done) {
        var meeting = {
          id: 1,
          title: 'Title',
          save: saveStub,
          dataValues: {}
        };

        createStub.returns(Promise.resolve(meeting));
        saveStub.returns(Promise.resolve(meeting));
        sendMailStub.returns(Promise.resolve(null));

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
            creator: 'me',
            name: 'Zeb',
            email: 'email3',
            schedule: [{300: true, 1200: true}, {}, {}, {1200: true, 1230: true}],
            locationPreferences: {wifi: true}
          })
          .end(function(err, res) {
            expect(err).to.not.exist;
            expect(res).to.have.status(200);
            expect(createStub.calledOnce).to.equal(true);
            expect(sendMailStub.calledOnce).to.equal(true);
            expect(saveStub.calledOnce).to.equal(true);
            done();
          });
      });

      it('should 500 with bad params', function(done) {
        createStub.returns(
          Promise.reject()
        );
        sendMailStub.returns(Promise.resolve(null));
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
            creator: 'me',
            name: 'Zeb',
            email: 'email3',
            schedule: [{300: true, 1200: true}, {}, {}, {1200: true, 1230: true}],
            locationPreferences: {wifi: true}
          })
          .end(function(err, res) {
            expect(err).to.exist;
            expect(res).to.have.status(500);
            expect(createStub.calledOnce).to.equal(true);
            expect(sendMailStub.calledOnce).to.equal(false);
            done();
          });
      });
    });

    describe('/meeting/:code', function() {
      it('should 200 when meeting exists', function(done) {
        findOneStub.returns(
          Promise.resolve({
            dataValues: {
              id: 1,
              code: 'asdf1',
              title: 'Title'
            }
          })
        );
        chai.request(app)
          .get('/meeting/asdf1')
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
          .get('/meeting/asdf1')
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
