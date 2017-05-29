import React, { Component } from 'react';
import './Location.css';

class Location extends Component {
  render() {
    return (
      <div className="form-group">
          <label>Location Preferences</label>
          <input value={this.value()} name="schedule" className="form-control" />
      </div>
    );
  }

  value() {
    return "test_location_preference"
  }
}

export default Location;
