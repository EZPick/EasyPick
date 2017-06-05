var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/response', router);
};

router.post('/create', function (req, res, next) {
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

  db.Response.create({
    name: req.body.name,
    email: req.body.email,
    schedule: req.body.schedule,
    locationPreferences: req.body.locationPreferences,
    MeetingId: req.body.meetingId
  }).then(function(result) {
    res.json({
      success: true
    });
  }).catch(function(err) {
    res.status(500).json({
      success: false
    });
  });
});
