import React, { Component } from 'react';
import './Schedule.css';

class Schedule extends Component {
  render() {
    return (
      <div>
        <h1>Schedule</h1>
        <div>This is a test.</div>
        <input value={this.value()} name="schedule" />
      </div>
    );
  }

  value() {
    return "test_schedule";
  }
}

export default Schedule;
