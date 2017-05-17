

var express = require('express'),
  config = require('./config/config'),
  db = require('./app/models');

var app = express();

app.get("/build", function(req, res){
	res.json({status: "success"});
});

module.exports = require('./config/express')(app, config);

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

