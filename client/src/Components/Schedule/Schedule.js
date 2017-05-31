import React, { Component } from 'react';
import fullCalendar from 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';
import $ from 'jquery';
import './Schedule.css';

class Schedule extends Component {
  componentDidMount() {
    $('#cal').fullCalendar({
      defaultView: 'agendaWeek',
      allDaySlot: false,
      selectable: true,
      header: {
        left: '',
        center: '',
        right: ''
      },
      // Only permit selections within one day
      selectConstraint:{
        start: '00:01',
        end: '23:59',
      },
      columnFormat: 'ddd',
      select: function (start, end, jsEvent, view) {
          $("#cal").fullCalendar('addEventSource', [{
              start: start,
              end: end,
              rendering: 'background',
              block: true
          }, ]);
          $("#cal").fullCalendar("unselect");
      },
      selectOverlap: function(event) {
        // Here you will get all background events which are on same time.
        console.log(event);
        $('#cal').fullCalendar('removeEvents', event._id);
        return false;
      }
    });
  }

  render() {
    return (
      <div className="form-group">
        <label>Schedule</label>
        <div id="cal"></div>
      </div>
    );
  }

  value() {
    var events = $('#cal').fullCalendar('clientEvents');
    var result = [{}, {}, {}, {}, {}, {}, {}];

    events.forEach(function(evt) {
      var dayIndex = evt.start.day();
      var minutesIn = (evt.start.hours() * 60) + evt.start.minutes();
      var endMinutesIn = (evt.end.hours() * 60) + evt.end.minutes()
      for (var i = minutesIn; i < endMinutesIn; i += 30) {
        result[dayIndex][i] = true;
      }
    });

    return result;
  }
}

export default Schedule;
