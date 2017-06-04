var express = require('express'),
  config = require('./config/config'),
  db = require('./app/models');

require('dotenv').config();

var app = express();

module.exports = require('./config/express')(app, config);

if (!module.parent) {
  // When we're actually running the server, namespace everything within /api
  var subapp = app;
  app = express();
  app.use('/api', subapp);
}

db.sequelize
  .sync()
  .then(function () {
    if (!module.parent) {
      app.listen(config.port, function () {
        console.log('Express server listening on port ' + config.port);
      });
    }
  }).catch(function (e) {
    throw new Error(e);
  });
