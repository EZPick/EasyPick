var moment = require('moment');

var yelp = require('graphql-client')({
  url: 'https://api.yelp.com/v3/graphql',
  headers: {
    Authentication: 'Bearer ' + process.env.YELP_TOKEN
  }
});

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

function calculateBufferAround(slot, day, durationFloored) {
  var bufferBeforeSlot = slot;

  while (bufferBeforeSlot > 0) {
    bufferBeforeSlot -= 30;
    if (!day[bufferBeforeSlot]) {
      break;
    }
  }

  var endOfMeeting = slot + durationFloored;
  var bufferAfterSlot = endOfMeeting;

  while (bufferAfterSlot < 1440) {
    bufferAfterSlot += 30;
    if (!day[bufferAfterSlot]) {
      break;
    }
  }

  // These are the *starts* of half-hour segments
  var bufferBefore = slot - bufferBeforeSlot - 30;
  var bufferAfter = bufferAfterSlot - endOfMeeting - 30;

  return Math.min(bufferBefore, bufferAfter);
}

function determineTime(responses, meeting) {
  var scheduleTally = [];
  var durationFloored = Math.floor((meeting.duration - 1) / 30) * 30;
  responses.forEach(function(response) {
    response.schedule.forEach(function(day, dayIndex) {
      for (var slot in day) {

        slot = parseInt(slot, 10);
        var isFreeForDuration = true;
        for (var i = slot; i <= slot + durationFloored; i += 30) {
          if (!day[i]) {
            isFreeForDuration = false;
            break;
          }
        }

        if (day.hasOwnProperty(slot) && day[slot] === true && isFreeForDuration) {
          // This person is available

          // Set up the day and slot, if they haven't been already
          scheduleTally[dayIndex] = scheduleTally[dayIndex] || {};
          scheduleTally[dayIndex][slot] = scheduleTally[dayIndex][slot] || [];

          scheduleTally[dayIndex][slot].push({
            email: response.email,
            buffer: calculateBufferAround(slot, day, durationFloored)
          });
        }
      }
    });
  });

  var highAttendanceTimes = [];
  var highestOverlap = 0;

  // Find the maximum attendance time(s)
  scheduleTally.forEach(function(day, dayIndex) {
    for (var slot in day) {
      if (day.hasOwnProperty(slot) && day[slot].length >= highestOverlap) {
        slot = parseInt(slot, 10);
        var thisTime = {
          day: dayIndex,
          minutesIn: slot,
          canMake: day[slot]
        };

        if (day[slot].length > highestOverlap) {
          // We just found a new leader
          highAttendanceTimes = [thisTime];
        } else {
          // We found a tie
          highAttendanceTimes.push(thisTime);
        }
        highestOverlap = day[slot].length;
      }
    }
  });

  var maxTotalBuffer = 0;
  var highBufferTimes = [];

  // Now we break ties using buffer time
  highAttendanceTimes.forEach(function(timeOption) {
    var totalBuffer = timeOption.canMake
      .map(function(x) { return x.buffer; })
      .reduce(function(acc, item) {
        return acc + item;
      });

    if (totalBuffer > maxTotalBuffer) {
      // New leader
      highBufferTimes = [timeOption];
      maxTotalBuffer = totalBuffer;
    } else if (totalBuffer === maxTotalBuffer) {
      // Tied
      highBufferTimes.push(timeOption);
    }
  });

  // We use the ISO standard rock-paper-scissors to break ties :P
  var time = highBufferTimes[Math.floor(Math.random() * highBufferTimes.length)];
  var allEmails = responses.map(function(resp) { return resp.email; });
  // Throw out the buffer information, it's not needed anymore
  time.canMake = time.canMake.map(function(x) { return x.email; });
  time.cantMake = allEmails.filter(function(x) {
    return time.canMake.indexOf(x) === -1;
  });

  return time;
}

function determineCategory(responses) {
  var attributeCounts = {
    wifi: 0,
    privacy: 0,
    quiet: 0,
    foodAndDrink: 0
    /*
    Note: I don't know if we can know these.
    closeToBusLines: 0,
    parkingLot: 0,
    openLate: 0
    */
  };

  Object.keys(attributeCounts).forEach(function(attr) {
    responses.forEach(function(response) {
      if (response[attr]) {
        attributeCounts[attr]++;
      }
    });
  });

  var first;
  var second;

  for (var attr in attributeCounts) {
    if (attributeCounts.hasOwnProperty(attr)) {
      if (!attributeCounts[first] || attributeCounts[attr] >= attributeCounts[first]) {
        second = first;
        first = attr;
      } else if (!attributeCounts[second] || attributeCounts[attr] >= attributeCounts[second]) {
        second = attr;
      }
    }
  }

  // TODO
  return 'coffee shop';
}

function determinePlace(responses, time, meeting) {
  var category = determineCategory(responses);
  var momentTime = moment()
    .day(time.day)
    .hour(Math.floor(time.minutesIn / 60))
    .minutes(time.minutesIn % 60);

  var query = `
    query SearchForBusinesses(
          $category: String,
          $radius: Integer,
          $generalLocation: String,
          $openAt: Integer) {
      search(term: $category,
             radius: $radius,
             # open_at: $openAt doesn't currently work
      			 location: $generalLocation) {
        business {
          name
          location {
            formatted_address
          }
        }
      }
    }`;

  var variables = {
    category: category,
    radius: meeting.radius,
    generalLocation: meeting.generalLocation,
    openAt: momentTime.unix()
  };

  return yelp.query(query, variables)
    .then(function(json) {
      return Promise.resolve(json.data.search.business[0]);
    });
}

module.exports = {
  makeDecisionAndSendEmails: function(meeting) {
    makeDecision(meeting)
      .then(function(values) {
        var responses = values[0];
        var time = values[1];
        var place = values[2];
        responses.forEach(function(response) {
          module.exports.sendEmailTo(response, time, place);
        });
      });
  },
  makeDecision: function(meeting) {
    return meeting.getResponses()
      .then(function(responses) {
        var time = determineTime(responses, meeting);
        return Promise.all([
          Promise.resolve(responses),
          Promise.resolve(time),
          determinePlace(responses, time, meeting)
        ]);
      });
  },
  sendEmailTo: function(responses, time, place) {
    var momentTime = moment()
      .day(time.day)
      .hour(Math.floor(time.minutesIn / 60))
      .minutes(time.minutesIn % 60);

    var cantMake = time.cantMake.map(function(x) { return x.name; }).join(', ');

    var mailOptions = {
      to: responses.map(function(x) { return x.email; }).join(', '),
      subject: 'Your Meeting Has Been Scheduled',
      text: `Your meeting has been scheduled for ${momentTime.format('h:mma on dddd')}.
        It's at ${place.name} (${place.location.formatted_address}).
        ${cantMake.length > 0 ? cantMake + " can't make it" : ''}`, // plain text body
      //html: '<b>Hello world ?</b>' // html body
    };

    return transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Email %s sent: %s', info.messageId, info.response);
    });
  }
};
