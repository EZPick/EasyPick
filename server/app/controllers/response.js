var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/api/response/', router);
};

router.post('/create', function (req, res, next) {
  db.Response.create({
    name: req.body.name,
    email: req.body.email,
    schedule: req.body.schedule,
    locationPreferences: req.body.locationPreferences,
    MeetingId: req.body.meetingId
  }).then(function(result) {
    res.json({
      success: true,
      data: result.dataValues
    });
  }).catch(function(err) {
    res.json({
      success: false,
      error: err
    });
  });
});
