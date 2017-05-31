import React, { Component } from 'react';
import './Create.css';
import Schedule from '../Schedule/Schedule';
import Location from '../Location/Location';
import $ from 'jquery';

class Create extends Component {
  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            {/*creation of new event title*/}
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <h1 id="title">Create an Event</h1>
            </div>
            <div className="col-sm-3"></div>
          </div>

          {/*creation of new event form*/}
          <div className="row" id="response-row">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <form id="creation-form" onSubmit={this.submit}>
                {/*response form needs an id*/}
                <input type="hidden" value={this.props.match.params.id} name="meetingId" />

                {/*name field*/}
                <div className="form-group">
                  <label>Name</label>
                  <input name="name" className="form-control" type="text" placeholder="Type your name" required />
                </div>

                {/*email field*/}                
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" className="form-control" type="text" placeholder="Type your email" required />
                </div>

                {/*location field*/}
                <div className="form-group">
                  <label>Location</label>
                  <Location />
                </div>

                {/*schedule field*/}
                <div className="form-group">
                  <label>Schedule</label>
                  <Schedule />
                </div>

                {/*button to submit*/}
                <div className="form-group" id="btn-container">
                  <button type="submit" className="btn btn-primary" id="submit-btn" alt="button to submit event form">Submit Your Event</button>
                </div>
              </form>
            </div>
  
            <div className="col-sm-3"></div>
          </div>
          <div className="row" id="confirmation-row">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <div className="alert alert-success fade in">
                <strong>Submission complete!</strong>
              </div>
            </div>
            <div className="col-sm-3"></div>
          </div>
          <div className="row" id="error-row">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <div className="alert alert-danger fade in">
                <strong>Submission failed!</strong> Please try again
                    </div>
            </div>
            <div className="col-sm-3"></div>
          </div>
        </div>
      </div>
    );
  }

  openPopup() {
    // Open the create invites popup
  }

  submit(e) {
    // Post creation data to server
      $('#error-row').hide();

      e.preventDefault();

      let form = $('#creation-form');

      $.ajax({
          type: 'POST',
          url: '/api/create',
          data: form.serialize()
      })
      .done(function(data) {
          $('#creation-form')[0].reset();
          $('#title').hide();
          $('#response-row').hide();
          $('#confirmation-row').fadeIn();
      })
      .fail(function(jqXhr) {
          $('#error-row').fadeIn();
      });



  }
}

export default Create;
