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

router.get('/d', function (req, res, next) {
  res.json({
    id: req.params.id,
    title: 'Fake Meeting'
  });
});

router.post('/create', function(req, res, next) {
  // Accept args in the form body
  res.json({
    success: true,
    meetingId: 'this is not real'
  });
});

router.get('/test', function(req, res, next) {
	res.send('Hello');
});

router.get('/test', function(req, res, next) {
	res.send('World');
	end();
});
