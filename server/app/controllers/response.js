var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/api/response/', router);
};

router.post('/create', function (req, res, next) {
  try {
    JSON.parse(req.body.schedule);
  } catch (e) {
    res.status(500).json({
      success: false
    });
    return;
  }

  try {
    JSON.parse(req.body.locationPreferences)
  } catch (e) {
    res.status(500).json({
      success: false
    });
    return;
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
