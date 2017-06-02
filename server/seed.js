var db = require('./app/models');

db.Meeting.create({
  closeoutTime: new Date(),
  title: 'Title',
  generalLocationLatitude: 47.6553,
  generalLocationLongitude: -122.3035,
  radius: 7000,
  duration: 30,
  invited: [],
  creator: 'me',
  responses: [
    {
      name: 'Zeb',
      email: 'zebburkeconte+test@gmail.com',
      schedule: [
        {
          300: true
        }
      ],
      locationPreferences: {
        foodAndDrink: true
      }
    }
  ]
}, {
  include: db.Response
}).then(function(meeting, y) {
  console.log(meeting);
  // console.log(y);
});

db.Response.create({
  closeoutTime: new Date(),
  title: 'Title',
  generalLocationLatitude: 47.6553,
  generalLocationLongitude: -122.3035,
  radius: 7000,
  duration: 30,
  invited: [],
  creator: 'me',
  responses: [
    {
      name: 'Zeb',
      email: 'zebburkeconte+test@gmail.com',
      schedule: [
        {
          300: true
        }
      ],
      locationPreferences: {
        foodAndDrink: true
      }
    }
  ]
}, {
  include: db.Response
}).then(function(meeting, y) {
  console.log(meeting);
  // console.log(y);
});
