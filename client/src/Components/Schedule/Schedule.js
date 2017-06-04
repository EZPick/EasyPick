import React, { Component } from 'react';
import './Schedule.css';

class Schedule extends Component {
  render() {
    return (
      <div className="form-group">
        <label>Schedule</label>
        <input value={this.value()} name="schedule" className="form-control" />
      </div>
    );
  }

  value() {
    return "test_schedule";
  }
}

export default Schedule;
