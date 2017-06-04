import React, { Component } from 'react';
import './Create.css';
import dateTimePicker from 'eonasdan-bootstrap-datetimepicker';
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';
import Schedule from '../Schedule/Schedule';
import Location from '../Location/Location';
import jQuery from 'jquery';
var $ = window.jQuery;
import moment from 'moment';

$ = $ || jQuery;

$.fn.locationpicker = $.fn.locationpicker || function() {};

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

class Create extends Component {
  componentDidMount() {
    $('#location-field').locationpicker({
      radius: 300,
      location: {
        latitude: 47.6062,
        longitude: -122.3321
      },
      inputBinding: {
        radiusInput: $('[name=radius]'),
        latitudeInput: $('[name=generalLocationLatitude]'),
        longitudeInput: $('[name=generalLocationLongitude]')
      }
    });

    (dateTimePicker.bind($('#datetimepicker')))();
  }

  render() {
    return (
      <div>
        <div className="container">
          <div className="row">
            {/*creation of new meeting title*/}
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <h1 id="title">Create a Meeting</h1>
            </div>
            <div className="col-sm-3"></div>
          </div>

          {/*creation of new meeting form*/}
          <div className="row" id="response-row">
            <div className="col-sm-3"></div>
            <div className="col-sm-6">
              <form id="creation-form" onSubmit={this.submit.bind(this)}>
                {/*title field*/}
                <div className="form-group">
                  <label>Meeting Name</label>
                  <input name="title" className="form-control" type="text" placeholder="Type the meeting's name" required />
                </div>
                {/*closeout time field*/}
                <div className="form-group">
                  <label>Close-out Time</label>
                  <div className='input-group date' id='datetimepicker'>
                    <input name="closeoutTime" type='text' className="form-control" />
                    <span className="input-group-addon">
                        <span className="glyphicon glyphicon-calendar"></span>
                    </span>
                  </div>
                </div>

                {/*radius field*/}
                <div className="form-group">
                  <label>Radius</label>
                  <input name="radius" className="form-control" type="number" placeholder="Type the radius in meters the meeting should be within" required />
                </div>

                <input type="hidden" name="generalLocationLatitude" />
                <input type="hidden" name="generalLocationLongitude" />

                <div id="location-field" style={{height: '400px'}}></div>

                {/*duration field*/}
                <div className="form-group">
                  <label>Duration</label>
                  <input name="duration" className="form-control" type="number" step="30" min="0" max="600" placeholder="Type the duration of the meeting in minutes" required />
                </div>
                {/*name field*/}
                <div className="form-group">
                  <label>Your Name</label>
                  <input name="name" className="form-control" type="text" placeholder="Type your name" required />
                </div>

                {/*email field*/}
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" className="form-control" type="text" placeholder="Type your email" required />
                </div>

                {/*location field*/}
                <div className="form-group">
                  <Location ref="location"/>
                </div>

                {/*schedule field*/}
                <div className="form-group">
                  <Schedule ref="schedule"/>
                </div>

                {/*button to submit*/}
                <div className="form-group" id="btn-container">
                  <button type="submit" className="btn btn-primary" id="submit-btn" alt="button to submit meeting form">Submit Your Meeting</button>
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

    var data = getFormData($('#creation-form'));
    data.schedule = this.refs.schedule.value();
    data.locationPreferences = this.refs.location.value();
    data.closeoutTime = moment(data.closeoutTime, 'MM/DD/YYYY h:mm A').toISOString();

    $.ajax({
        type: 'POST',
        url: '/api/meeting/create',
        data: $.param(data)
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
