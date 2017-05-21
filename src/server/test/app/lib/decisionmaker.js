'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');
var moment = require('moment');

var fakeBiz = {
  name: 'Fake Business',
  location: {
    formatted_address: 'Fake Address'
  }
};

var graphQlMock = {query: null};

mockery.registerMock('graphql-client', function() {
  return graphQlMock;
});

mockery.enable({
  warnOnUnregistered: false
});

var decisionMaker = require('../../../app/lib/decisionmaker');

mockery.disable();

describe('decisionMaker', function() {
  var queryStub;
  beforeEach(function() {
    queryStub = sinon.stub().returns(
      Promise.resolve({
        data: {
          search: {
            business: [fakeBiz]
          }
        }
      })
    );

    graphQlMock.query = queryStub;
  });

  it('should load', function() {
    expect(decisionMaker.makeDecision).to.be.a('function');
    expect(decisionMaker.sendEmailTo).to.be.a('function');
    expect(decisionMaker.makeDecisionAndSendEmails).to.be.a('function');
  });

  describe('makeDecision', function() {
    it('should detect when everyone has the same one-time schedule', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          email: 'fakeemail1',
          schedule: [
            // Sunday
            {
              450: true
            }
          ]
        },
        // Person 2
        {
          email: 'fakeemail2',
          schedule: [
            // Sunday
            {
              450: true
            }
          ]
        },
        // Person 3
        {
          email: 'fakeemail3',
          schedule: [
            // Sunday
            {
              450: true
            }
          ]
        }
      ];

      meeting.radius = 2000;
      meeting.generalLocation = 'over there';

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      return decisionMaker.makeDecision(meeting)
        .then(function(values) {
          expect(queryStub.calledOnce).to.equal(true);
          expect(queryStub.calledWith(
            sinon.match.string,
            sinon.match({
              category: 'coffee shop',
              radius: 2000,
              generalLocation: 'over there',
              openAt: moment()
                .day(0)
                .hours(7)
                .minutes(30)
                .unix()
            })
          )).to.equal(true);


          var time = values[1];
          expect(time).to.deep.equal({
            day: 0,
            minutesIn: 450,
            canMake: ['fakeemail1', 'fakeemail2', 'fakeemail3'],
            cantMake: []
          });

          var place = values[2];
          expect(place).to.equal(fakeBiz);
        });
    });

    it('should detect when everyone has one overlap', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          email: 'fakeemail1',
          schedule: [
            {},
            // Monday
            {
              900: true
            },
            // Tuesday
            {
              480: true
            }
          ]
        },
        // Person 2
        {
          email: 'fakeemail2',
          schedule: [
            // Sunday
            {
              450: true
            },
            {},
            // Tuesday
            {
              480: true
            },
            {},
            // Thursday
            {
              300: true
            },
            // Friday
            {
              1380: true
            }
          ]
        },
        // Person 3
        {
          email: 'fakeemail3',
          schedule: [
            {},
            {},
            // Tuesday
            {
              480: true
            },
            // Wednesday
            {
              450: true,
              480: true,
              1380: true
            },
            // Thursday
            {
              900: true,
              930: true
            }
          ]
        }
      ];

      meeting.radius = 2000;
      meeting.generalLocation = 'over there';

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      return decisionMaker.makeDecision(meeting)
        .then(function(values) {
          var time = values[1];
          expect(time).to.deep.equal({
            day: 2,
            minutesIn: 480,
            canMake: ['fakeemail1', 'fakeemail2', 'fakeemail3'],
            cantMake: []
          });

          var place = values[2];
          expect(place).to.equal(fakeBiz);

          expect(queryStub.calledOnce).to.equal(true);
          expect(queryStub.calledWith(
            sinon.match.string,
            sinon.match({
              category: 'coffee shop',
              radius: 2000,
              generalLocation: 'over there',
              openAt: moment()
                .day(2)
                .hours(8)
                .minutes(0)
                .unix()
            })
          )).to.equal(true);
        });
    });

    it("should find the best overlap when there's no full overlap", function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          email: 'fakeemail1',
          schedule: [
            {},
            // Monday
            {
              900: true
            },
            // Tuesday
            {
              480: true
            }
          ]
        },
        // Person 2
        {
          email: 'fakeemail2',
          schedule: [
            // Sunday
            {
              450: true
            },
            {},
            // Tuesday
            {
              540: true
            },
            {},
            // Thursday
            {
              300: true
            },
            // Friday
            {
              1380: true
            }
          ]
        },
        // Person 3
        {
          email: 'fakeemail3',
          schedule: [
            {},
            {},
            // Tuesday
            {
              480: true
            },
            // Wednesday
            {
              450: true,
              480: true,
              1380: true
            },
            // Thursday
            {
              900: true,
              930: true
            }
          ]
        }
      ];

      meeting.radius = 2000;
      meeting.generalLocation = 'over there';

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      var queryStub = sinon.stub().returns(
        Promise.resolve({
          data: {
            search: {
              business: [fakeBiz]
            }
          }
        })
      );

      graphQlMock.query = queryStub;

      return decisionMaker.makeDecision(meeting)
        .then(function(values) {
          var time = values[1];
          expect(time).to.deep.equal({
            day: 2,
            minutesIn: 480,
            canMake: ['fakeemail1', 'fakeemail3'],
            cantMake: ['fakeemail2']
          });

          var place = values[2];
          expect(place).to.equal(fakeBiz);

          expect(queryStub.calledOnce).to.equal(true);
          expect(queryStub.calledWith(
            sinon.match.string,
            sinon.match({
              category: 'coffee shop',
              radius: 2000,
              generalLocation: 'over there',
              openAt: moment()
                .day(2)
                .hours(8)
                .minutes(0)
                .unix()
            })
          )).to.equal(true);
        });
    });

    it('prioritizes times with more buffer', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          email: 'fakeemail1',
          schedule: [
            {},
            // Monday
            {
              900: true
            },
            // Tuesday
            {
              450: true,
              480: true,
              510: true
            },
            {},
            // Thursday
            {
              930: true,
              960: true,
              990: true
            }
          ]
        },
        // Person 2
        {
          email: 'fakeemail2',
          schedule: [
            // Sunday
            {
              450: true
            },
            {},
            // Tuesday
            {
              480: true,
              540: true
            },
            {},
            // Thursday
            {
              300: true,

              900: true,
              930: true,
              960: true,
              990: true,
              1020: true
            },
            // Friday
            {
              1380: true
            }
          ]
        },
        // Person 3
        {
          email: 'fakeemail3',
          schedule: [
            {},
            {},
            // Tuesday
            {
              450: true,
              480: true,
              510: true
            },
            // Wednesday
            {
              450: true,
              480: true,
              1380: true
            },
            // Thursday
            {
              870: true,
              900: true,
              930: true,
              960: true,
              990: true,
              1020: true,
              1050: true
            }
          ]
        }
      ];

      meeting.radius = 2000;
      meeting.generalLocation = 'over there';

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      var queryStub = sinon.stub().returns(
        Promise.resolve({
          data: {
            search: {
              business: [fakeBiz]
            }
          }
        })
      );

      graphQlMock.query = queryStub;

      return decisionMaker.makeDecision(meeting)
        .then(function(values) {
          var time = values[1];
          expect(time).to.deep.equal({
            day: 4,
            minutesIn: 960,
            canMake: ['fakeemail1', 'fakeemail2', 'fakeemail3'],
            cantMake: []
          });

          var place = values[2];
          expect(place).to.equal(fakeBiz);

          expect(queryStub.calledOnce).to.equal(true);
          expect(queryStub.calledWith(
            sinon.match.string,
            sinon.match({
              category: 'coffee shop',
              radius: 2000,
              generalLocation: 'over there',
              openAt: moment()
                .day(4)
                .hours(16)
                .minutes(0)
                .unix()
            })
          )).to.equal(true);
        });
    });

    it('prioritizes times with more buffer with incomplete overlap', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          email: 'fakeemail1',
          schedule: [
            {},
            // Monday
            {
              900: true
            },
            // Tuesday
            {
              450: true,
              480: true,
              510: true
            },
            {}
          ]
        },
        // Person 2
        {
          email: 'fakeemail2',
          schedule: [
            // Sunday
            {
              450: true
            },
            {},
            // Tuesday
            {
              480: true,
              540: true
            },
            {},
            // Thursday
            {
              300: true,

              900: true,
              930: true,
              960: true,
              990: true,
              1020: true
            },
            // Friday
            {
              1380: true
            }
          ]
        },
        // Person 3
        {
          email: 'fakeemail3',
          schedule: [
            {},
            {},
            // Tuesday
            {
              450: true,
              510: true
            },
            // Wednesday
            {
              450: true,
              480: true,
              1380: true
            },
            // Thursday
            {
              870: true,
              900: true,
              930: true,
              960: true,
              990: true,
              1020: true,
              1050: true
            }
          ]
        }
      ];

      meeting.radius = 2000;
      meeting.generalLocation = 'over there';

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      var queryStub = sinon.stub().returns(
        Promise.resolve({
          data: {
            search: {
              business: [fakeBiz]
            }
          }
        })
      );

      graphQlMock.query = queryStub;

      return decisionMaker.makeDecision(meeting)
        .then(function(values) {
          var time = values[1];
          expect(time).to.deep.equal({
            day: 4,
            minutesIn: 960,
            canMake: ['fakeemail2', 'fakeemail3'],
            cantMake: ['fakeemail1']
          });

          var place = values[2];
          expect(place).to.equal(fakeBiz);

          expect(queryStub.calledOnce).to.equal(true);
          expect(queryStub.calledWith(
            sinon.match.string,
            sinon.match({
              category: 'coffee shop',
              radius: 2000,
              generalLocation: 'over there',
              openAt: moment()
                .day(4)
                .hours(16)
                .minutes(0)
                .unix()
            })
          )).to.equal(true);
        });
    });
  });
});
