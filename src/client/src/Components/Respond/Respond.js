import React, { Component } from 'react';
import './Respond.css';

class Respond extends Component {
  render() {
    return (
      <div>
        <h1>Respond</h1>
        <form id="response-form" method="post" action="/api/response/create">
            <div>
                <label>Name</label>
                <input name="name" type="text" />
            </div>
            <div>
                <label>Email</label>
                <input name="email" type="text" />
            </div>
            <div>
                <label>Location Preferences</label>
                <input name="locationPreferences" type="text" />
            </div>
            <div>
                <label>Schedule</label>
                <input name="schedule" type="text" />
            </div>
            <div>
                <input type="submit" value="Submit" />
            </div>
        </form>
      </div>
    );
  }

  submit() {
    // Post to server
  }
}

export default Respond;
