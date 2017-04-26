var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/api/response/', router);
};

router.post('/create', function (req, res, next) {
  // Accept args in the form body
  res.json({
    success: true
  });
});
