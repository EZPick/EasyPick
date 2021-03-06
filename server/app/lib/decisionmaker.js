var moment = require('moment');
var db = require('../models');

var yelp = require('./graphql-client.js')({
  url: 'https://api.yelp.com/v3/graphql',
  headers: {
    Authorization: 'Bearer ' + process.env.YELP_TOKEN
  }
});

var nodemailer = require('nodemailer');
var EmailTemplate = require('email-templates').EmailTemplate;

var transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

var sendDecisionEmail = transporter
  .templateSender(
    new EmailTemplate(process.env.NODE_ENV == 'production' ? './server/app/email-templates/decision' : './app/email-templates/decision'),
    {
      subject: 'Your Meeting Has Been Scheduled',
      from: process.env.EMAILS_FROM
    }
  );

function militaryToMoment(military, day) {
  return moment().day(day)
    .hours(military.slice(0, 2))
    .minutes(military.slice(2, 4))
    .seconds(0)
    .milliseconds(0);
}

function isOpenAt(hoursArray, momentTime) {
  var day = momentTime.day();
  for (var i = 0; i < hoursArray.open.length; i++) {
    var hoursSpan = hoursArray.open[i];
    var startMoment = militaryToMoment(hoursSpan.start, day);
    var endMoment = militaryToMoment(hoursSpan.end, day);
    if (hoursSpan.day === day) {
      if (!hoursSpan.is_overnight) {
        // This means that the startMoment is before the endMoment
        // (i.e. they do not span midnight)
        if (momentTime.isBetween(startMoment, endMoment)) {
          return true;
        }
      } else {
        // This effectively means that the actual span is from startMoment ->
        // midnight -> endMoment
        // Because the day matched, we just have to check if it's after the
        // startMoment
        if (momentTime.isAfter(startMoment)) {
          return true;
        }
      }
    } else if (hoursSpan.day + 1 === day && hoursSpan.is_overnight) {
      // This might match if it's in the wee hours
      // This is the midnight -> endMoment part of the range
      if (momentTime.isBefore(endMoment)) {
        return true;
      }
    }
  }
  return false;
}

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
  // NOTE: When a meeting is 90 minutes long, for instance, we want to schedule
  // it into a 90-minute slot, even though technically that would give the person
  // 0 minutes to get to their next thing
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

        if (day.hasOwnProperty(slot) && day[slot].toString() === 'true' && isFreeForDuration) {
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

  if (highAttendanceTimes.length === 0) {
    // When nobody is available at all (at any time--everyone filled out blank
    // schedules), we just give them a default time: wednesday at noon. Hard to
    // know what to do in this situation if you don't do this.
    // NOTE: Our frontend does not allow posting an empty schedule anymore. This
    // deals with legacy meetings and other stuff that snuck into the database.
    highAttendanceTimes = [{
      day: 3,
      minutesIn: 720,
      canMake: []
    }];
  }

  var maxTotalBuffer = 0;
  var highBufferTimes = [];

  // Now we break ties using buffer time
  highAttendanceTimes.forEach(function(timeOption) {
    var totalBuffer = timeOption.canMake
      .map(function(x) { return x.buffer; })
      .reduce(function(acc, item) {
        return acc + item;
      }, 0);

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
      if (response[attr] && response[attr].toString() === 'true') {
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

  if (first === 'foodAndDrink' && second !== 'wifi') {
    return 'cafe';
  } else if (first === 'quiet' || second === 'quiet') {
    return 'library';
  } else {
    return 'coffee shop';
  }
}

function determinePlace(responses, time, meeting) {
  var category = determineCategory(responses);
  var momentTime = moment()
    .day(time.day)
    .hour(Math.floor(time.minutesIn / 60))
    .minutes(time.minutesIn % 60);

  var query = `
    {
      search(term: "${category}",
             radius: ${meeting.radius.toString()},
             longitude: ${meeting.generalLocationLongitude.toString()},
             latitude: ${meeting.generalLocationLatitude.toString()}
             ) {
        business {
          name
          hours {
            open {
              day
              start
              end
              is_overnight
            }
          }
          location {
            formatted_address
          }
        }
      }
    }`;

  return yelp.query(query)
    .then(function(json) {
      var businesses = json.data.search.business;
      for (var i = 0; i < businesses.length; i++) {
        // Hours is an array for some reason?
        if (isOpenAt(businesses[i].hours[0], momentTime)) {
          return Promise.resolve(businesses[i]);
        }
      }
      return Promise.resolve(null);
    });
}

module.exports = {
  makeDecisionAndSendEmails: function(meeting) {
    return module.exports.makeDecision(meeting)
      .then(function([responses, decision]) {
        module.exports.sendEmailTo(responses, decision);
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
      })
      .then(function([responses, time, place]) {
        var canMake = [];
        var cantMake = [];
        time.canMake.forEach(function(email) {
          var resp = responses.filter(x => x.email === email)[0];
          canMake.push(resp.id);
        });
        time.cantMake.forEach(function(email) {
          var resp = responses.filter(x => x.email === email)[0];
          cantMake.push(resp.id);
        });

        return Promise.all([
          Promise.resolve(responses),
          db.Decision.create({
            address: place == null ? null : place.location.formatted_address,
            nameOfLocation: place == null ? null : place.name,
            dayOfWeek: time.day,
            minutesIn: time.minutesIn,
            canMake: canMake,
            cantMake: cantMake,
            MeetingId: meeting.id
          })
        ]);
      });
  },
  sendEmailTo: function(responses, decision) {
    var momentTime = moment()
      .day(decision.dayOfWeek)
      .hour(Math.floor(decision.minutesIn / 60))
      .minutes(decision.minutesIn % 60);

    var cantMake = decision.cantMake.map(function(x) { return x.name; });

    return sendDecisionEmail(
      {
        to: responses.map(function(x) { return x.email; }).join(', ')
      },
      {
        momentTime: momentTime,
        address: decision.address,
        nameOfLocation: decision.nameOfLocation,
        cantMake: cantMake
      }
    );
  }
};
