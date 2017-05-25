import React, { Component } from 'react';
import './Create.css';

class Create extends Component {
  render() {
    return (
      <div>
        <h1>Create</h1>

        {/*begin form code*/}
        <form id="response-form" method="post" action="/api/response/create">
          <div>
            <label>Name</label>
            <input name="name" type="text" />
          </div>
          <p></p>
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

  openPopup() {
    // Open the create invites popup
  }

  submit() {
    // Post data to server
  }
}

export default Create;
