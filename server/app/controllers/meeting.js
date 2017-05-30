var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/meeting', router);
};

router.get('/get', function (req, res, next) {
  db.Meeting.findOne({
    where: {
	  	id: req.query.id,
		},
		include: [{
			model: db.Response,
		}]
  }).then(function(meeting) {
    res.json({
	  	success : true,
	  	data : meeting.dataValues,
		});
  }).catch(function(err) {
    res.json({
	  	success : false,
	    error : err,
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
	  	success : true,
	  	data : result.dataValues,
		});
  }).catch(function(err) {
    res.json({
	  	success : false,
	  	error : err,
		});
  });

});

