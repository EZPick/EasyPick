process.env.NODE_ENV = 'production';

var express = require('express'),
  config = require('./server/config/config.js'),
  db = require('./server/app/models'),
  sub = require('./server/app.js');
  path = require('path');

// Main App

var app = express();

app.use("/api", sub);

app.use(express.static('client/build'));

app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

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

module.exports = require('./server/config/express')(app, config);

var schedule = require('node-schedule');
var decisionMaker = require('./server/app/lib/decisionmaker');
var ONE_HOUR = 60 * 60 * 1000;

schedule.scheduleJob('0 * * * *', function() {
  var now = new Date();
  db.Meeting.findAll({
    where: {
      closeoutTime: {
        gt: new Date(now.getTime() - ONE_HOUR)
      }
    }
  }).then(function(meetings) {
    var promises = [];
    meetings.forEach(function(m) {
      promises.push(decisionMaker.makeDecisionAndSendEmails(m));
    });
    return Promise.all(promises);
  }).then(function() {
    console.log('all done making decisions!');
  });
});
