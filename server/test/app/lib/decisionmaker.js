'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');
var moment = require('moment');

var fakeBiz = {
  name: 'Fake Business',
  location: {
    formatted_address: 'Fake Address'
  },
  hours: [
    {
      open: [
        { day: 0, start: '0000', end: '0000', is_overnight: true },
        { day: 1, start: '0000', end: '0000', is_overnight: true },
        { day: 2, start: '0000', end: '0000', is_overnight: true },
        { day: 3, start: '0000', end: '0000', is_overnight: true },
        { day: 4, start: '0000', end: '0000', is_overnight: true },
        { day: 5, start: '0000', end: '0000', is_overnight: true },
        { day: 6, start: '0000', end: '0000', is_overnight: true }
      ]
    }
  ]
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
var sendMailSpy = sinon.spy();
var decisionCreateSpy = sinon.spy(function(opts) {
  opts.id = 1;
  return Promise.resolve(opts);
});

mockery.registerMock('./graphql-client.js', function() {
  return {
    query: queryStub
  };
});

mockery.registerMock('nodemailer', {
  createTransport: function() {
    return {
      templateSender: function() {
        return sendMailSpy;
      }
    };
  }
});

mockery.registerMock('../models', {
  Decision: {
    create: decisionCreateSpy
  }
});

mockery.enable({
  warnOnUnregistered: false
});

var decisionMaker = require('../../../app/lib/decisionmaker');

mockery.disable();

describe('decisionMaker', function() {
  beforeEach(function() {
    queryStub.resetHistory();
    sendMailSpy.reset();
    decisionCreateSpy.reset();
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
          id: 1,
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
          id: 2,
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
          id: 3,
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
      meeting.duration = 30;
      meeting.generalLocationLongitude = -100.0;
      meeting.generalLocationLatitude = 43.0;
      meeting.id = 1;

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      return decisionMaker.makeDecision(meeting)
        .then(function([responses, decision]) {
          expect(queryStub.calledOnce).to.equal(true);

          expect(decisionCreateSpy.calledOnce).to.equal(true);

          expect(decision.MeetingId).to.equal(1);
          expect(decision.dayOfWeek).to.equal(0);
          expect(decision.minutesIn).to.equal(450);
          expect(decision.cantMake).to.deep.equal([]);
          expect(decision.canMake).to.deep.equal([1, 2, 3]);

          expect(decision.nameOfLocation).to.equal(fakeBiz.name);
          expect(decision.address).to.equal(fakeBiz.location.formatted_address);
        });
    });

    it('should detect when everyone has one overlap', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          id: 1,
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
          id: 2,
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
          id: 3,
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
      meeting.duration = 30;
      meeting.generalLocationLongitude = -100.0;
      meeting.generalLocationLatitude = 43.0;

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      meeting.id = 1;

      return decisionMaker.makeDecision(meeting)
        .then(function([responses, decision]) {
          expect(decision.MeetingId).to.equal(1);
          expect(decision.dayOfWeek).to.equal(2);
          expect(decision.minutesIn).to.equal(480);
          expect(decision.canMake).to.deep.equal([1, 2, 3]);
          expect(decision.cantMake).to.deep.equal([]);

          expect(decision.nameOfLocation).to.equal(fakeBiz.name);
          expect(decision.address).to.equal(fakeBiz.location.formatted_address);

          expect(queryStub.calledOnce).to.equal(true);

          expect(decisionCreateSpy.calledOnce).to.equal(true);
        });
    });

    it("should find the best overlap when there's no full overlap", function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          id: 1,
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
          id: 2,
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
          id: 3,
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
      meeting.duration = 30;
      meeting.generalLocationLongitude = -100.0;
      meeting.generalLocationLatitude = 43.0;

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      meeting.id = 1;

      return decisionMaker.makeDecision(meeting)
        .then(function([responses, decision]) {
          expect(decision.MeetingId).to.equal(1);
          expect(decision.dayOfWeek).to.equal(2);
          expect(decision.minutesIn).to.equal(480);
          expect(decision.canMake).to.deep.equal([1, 3]);
          expect(decision.cantMake).to.deep.equal([2]);

          expect(decision.nameOfLocation).to.equal(fakeBiz.name);
          expect(decision.address).to.equal(fakeBiz.location.formatted_address);

          expect(queryStub.calledOnce).to.equal(true);

          expect(decisionCreateSpy.calledOnce).to.equal(true);
        });
    });

    it('prioritizes times with more buffer', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          id: 1,
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
          id: 2,
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
          id: 3,
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
      meeting.duration = 30;
      meeting.generalLocationLongitude = -100.0;
      meeting.generalLocationLatitude = 43.0;

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      meeting.id = 1;

      return decisionMaker.makeDecision(meeting)
        .then(function([responses, decision]) {
          expect(decision.MeetingId).to.equal(1);
          expect(decision.dayOfWeek).to.equal(4);
          expect(decision.minutesIn).to.equal(960);
          expect(decision.canMake).to.deep.equal([1, 2, 3]);
          expect(decision.cantMake).to.deep.equal([]);

          expect(decision.nameOfLocation).to.equal(fakeBiz.name);
          expect(decision.address).to.equal(fakeBiz.location.formatted_address);

          expect(queryStub.calledOnce).to.equal(true);

          expect(decisionCreateSpy.calledOnce).to.equal(true);
        });
    });

    it('prioritizes times with more buffer with incomplete overlap', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          id: 1,
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
          id: 2,
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
          id: 3,
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
      meeting.duration = 30;
      meeting.generalLocationLongitude = -100.0;
      meeting.generalLocationLatitude = 43.0;

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      meeting.id = 1;

      return decisionMaker.makeDecision(meeting)
        .then(function([responses, decision]) {
          expect(decision.MeetingId).to.equal(1);
          expect(decision.dayOfWeek).to.equal(4);
          expect(decision.minutesIn).to.equal(960);
          expect(decision.canMake).to.deep.equal([2, 3]);
          expect(decision.cantMake).to.deep.equal([1]);

          expect(decision.nameOfLocation).to.equal(fakeBiz.name);
          expect(decision.address).to.equal(fakeBiz.location.formatted_address);

          expect(queryStub.calledOnce).to.equal(true);

          expect(decisionCreateSpy.calledOnce).to.equal(true);
        });
    });

    it('should respect duration', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          id: 1,
          email: 'fakeemail1',
          schedule: [
            {},
            // Monday
            {
              900: true
            },
            // Tuesday
            {
              // This is not actually free because the meeting's an hour long!
              480: true
            },
            {},
            // Thursday
            {
              300: true,
              330: true
            }
          ]
        },
        // Person 2
        {
          id: 2,
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
              510: true
            },
            {},
            // Thursday
            {
              300: true,
              330: true
            },
            // Friday
            {
              1380: true
            }
          ]
        },
        // Person 3
        {
          id: 3,
          email: 'fakeemail3',
          schedule: [
            {},
            {},
            // Tuesday
            {
              450: true,
              480: true,
              510: true,
              540: true
            },
            // Wednesday
            {
              450: true,
              480: true,
              1380: true
            },
            // Thursday
            {
              300: true,
              330: true,
              900: true,
              930: true
            }
          ]
        }
      ];

      meeting.radius = 2000;
      meeting.duration = 60;
      meeting.generalLocationLongitude = -100.0;
      meeting.generalLocationLatitude = 43.0;

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      meeting.id = 1;

      return decisionMaker.makeDecision(meeting)
        .then(function([responses, decision]) {
          expect(decision.MeetingId).to.equal(1);
          expect(decision.dayOfWeek).to.equal(4);
          expect(decision.minutesIn).to.equal(300);
          expect(decision.canMake).to.deep.equal([1, 2, 3]);
          expect(decision.cantMake).to.deep.equal([]);

          expect(decision.nameOfLocation).to.equal(fakeBiz.name);
          expect(decision.address).to.equal(fakeBiz.location.formatted_address);

          expect(queryStub.calledOnce).to.equal(true);

          expect(decisionCreateSpy.calledOnce).to.equal(true);
        });
    });

    it('uses duration when evaluating buffer', function() {
      var meeting = {};

      var responses = [
        // Person 1
        {
          id: 1,
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
              840: true,
              870: true,
              900: true,
              930: true, // MEETING
              960: true, // MEETING
              990: true, // MEETING
              1020: true,
              1050: true,
              1080: true
            }
          ]
        },
        // Person 2
        {
          id: 2,
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
              930: true, // MEETING
              960: true, // MEETING
              990: true, // MEETING
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
          id: 3,
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
              930: true, // MEETING
              960: true, // MEETING
              990: true, // MEETING
              1020: true,
              1050: true
            }
          ]
        }
      ];

      meeting.radius = 2000;
      meeting.duration = 90;
      meeting.generalLocationLongitude = -100.0;
      meeting.generalLocationLatitude = 43.0;

      meeting.getResponses = function() {
        return Promise.resolve(responses);
      };

      meeting.id = 1;

      return decisionMaker.makeDecision(meeting)
        .then(function([responses, decision]) {
          expect(decision.MeetingId).to.equal(1);
          expect(decision.dayOfWeek).to.equal(4);
          expect(decision.minutesIn).to.equal(930);
          expect(decision.canMake).to.deep.equal([1, 2, 3]);
          expect(decision.cantMake).to.deep.equal([]);

          expect(decision.nameOfLocation).to.equal(fakeBiz.name);
          expect(decision.address).to.equal(fakeBiz.location.formatted_address);

          expect(queryStub.calledOnce).to.equal(true);

          expect(decisionCreateSpy.calledOnce).to.equal(true);
        });
    });
  });

  describe('sendEmailTo', function() {
    it('should send emails to the addresses supplied', function() {
      var responses = [
        {
          email: 'fakeemail1'
        },
        {
          email: 'fakeemail2'
        },
        {
          email: 'fakeemail3'
        }
      ];
      var decision = {
        dayOfWeek: 4,
        minutesIn: 450,
        canMake: ['fakeemail1', 'fakeemail2', 'fakeemail3'],
        cantMake: [],
        address: fakeBiz.location.formatted_address,
        nameOfLocation: fakeBiz.name
      };
      decisionMaker.sendEmailTo(responses, decision);

      expect(sendMailSpy.calledOnce).to.equal(true);

      expect(sendMailSpy.calledWith(
        sinon.match({
          to: 'fakeemail1, fakeemail2, fakeemail3'
        })
      )).to.equal(true);
    });
  });
});
