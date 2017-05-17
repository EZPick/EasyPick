var express = require('express'),
  router = express.Router(),
  db = require('../models'),
  config = require('../../config/config');

module.exports = function (app) {
  if (config.env == 'development') {
    app.use('/api/meeting', router);
  } else {
    app.use('/meeting', router);
  }
};

router.post('/create', function(req, res, next) {
  // Accept args in the form body
  res.json({
    success: true,
    meetingId: 'this is not real'
  });
});

router.get('/:id', function (req, res, next) {
  res.json({
    id: req.params.id,
    title: 'Fake Meeting'
  });
});
