var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  nodemailer = require('nodemailer'),
  EmailTemplate = require('email-templates').EmailTemplate;

var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

var sendInviteEmail = transporter
  .templateSender(
    new EmailTemplate('./app/email-templates/invite'),
    {
      subject: 'You have been invited to an EZPick meeting.',
      from: process.env.EMAILS_FROM
    }
  );

module.exports = function (app) {
  app.use('/meeting', router);
};

router.get('/:id', function (req, res, next) {
  db.Meeting.findOne({
    where: {
      id: req.params.id,
    },
    include: [{
      model: db.Response,
    }, {
      model: db.Decision
    }]
  }).then(function(meeting) {
    res.json({
      success: true,
      data: meeting.dataValues,
    });
  }).catch(function(err) {
    res.status(404).json({
      success: false
    });
  });
});

router.post('/create', function(req, res, next) {
  if (typeof req.body.schedule === 'string') {
    try {
      JSON.parse(req.body.schedule);
    } catch (e) {
      return res.status(500).json({
        success: false
      });
    }
  }

  if (typeof req.body.locationPreferences === 'string') {
    try {
      JSON.parse(req.body.locationPreferences);
    } catch (e) {
      return res.status(500).json({
        success: false
      });
    }
  }
  // Accept args in the form body
  db.Meeting.create({
    // set Model values
    title: req.body.title,
    closeoutTime: req.body.closeoutTime,
    generalLocationLatitude: req.body.generalLocationLatitude,
    generalLocationLongitude: req.body.generalLocationLongitude,
    radius: req.body.radius,
    duration: req.body.duration,
    invited: [],
    creator: req.body.creator,
    Responses: [{
      name: req.body.name,
      email: req.body.email,
      schedule: req.body.schedule,
      locationPreferences: req.body.locationPreferences
    }]
  }, {
    include: [{association: db.Meeting.Responses}]
  }).then(function(result) {
    res.json({
      success: true,
      data: result.dataValues,
    });
  }).catch(function(err) {
    res.status(500).json({
      success: false
    });
  });
});

router.post('/invite', function(req, res, next) {
  db.Meeting.findOne({
    where: {
      id: req.body.id,
    },
  }).then(function(meeting) {
    req.body.emails.forEach(function(x) {
      if (meeting.invited.indexOf(x) === -1) {
        meeting.invited.push(x);
      }
    });

    var emailPromise = sendInviteEmail(
      {
        to: req.body.emails.join(', ')
      },
      {
        meetingTitle: meeting.title,
        responseLink: 'http://ezpick.herokuapp.com/respond/' + meeting.id,
      }
    );

    return Promise.all([emailPromise, meeting.save()]);
  })
  .then(function() {
    res.json({
      success: true
    });
  })
  .catch(function(err) {
    res.status(500).json({
      success: false
    });
  });
});
