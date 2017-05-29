var express = require('express'),
  router = express.Router(),
  db = require('../models');

module.exports = function (app) {
  app.use('/api/meeting/', router);
};

router.get('/get', function (req, res, next) {
  db.Meeting.findOne({
    where: {
	  	id: req.params.id,
		},
		include: [{
			model: db.response
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

  	title : req.title,
		closeoutTime : req.closeoutTime,
		generalLocationLatitude : req.generalLocationLatitude,
		generalLocationLongitude : req.generalLocationLongitude,
		radius : req.radius,
		duration : req.duration,
		invited : req.invited,
		creator : req.creator,
	
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

