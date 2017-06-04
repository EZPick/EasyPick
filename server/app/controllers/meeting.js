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
  // Accept args in the form body
  db.Meeting.create({
    // set Model values
    title : req.body.title,
    closeoutTime : req.body.closeoutTime,
    generalLocationLatitude : req.body.generalLocationLatitude,
    generalLocationLongitude : req.body.generalLocationLongitude,
    radius : req.body.radius,
    duration : req.body.duration,
    invited : req.body.invited,
    creator : req.body.creator,
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
  var Meeting;
  db.Meeting.findOne({
    where: {
      id: req.query.id,
    },
  }).then(function(meeting) {
    // Make sure the model is being correctly found here
    Meeting = meeting;
  }).catch(function(err) {
    res.json({
      success : false,
      error : err,
    });
  });

  return sendInviteEmail(
    {
      // Not sure if it's correctly done here
      to: res.map(function(x) { return x.email; }).join(', ')
    },
    {
      meetingTitle: Meeting.title,
      link: '/respond/' + Meeting.id,
    }
  );
});
