import React, { Component } from 'react';
import './Respond.css';
import dateTimePicker from 'eonasdan-bootstrap-datetimepicker';
import 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.css';
import Schedule from '../Schedule/Schedule';
import Location from '../Location/Location';
import jQuery from 'jquery';
var $ = window.jQuery;

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

class Respond extends Component {
  constructor(props) {
    super(props);
    this.state = {data: {}};
    $.ajax({
          url: '/api/meeting/' + this.props.match.params.id,
          dataType: 'json',
          cacheL: false,
          success: data => {
            this.setState({data: data.data });
          },
          error: function(xhr, status, err) {
              console.log("SOI SOI SOI SOI ERROR");
              return err;
          }
     });
  }

  componentDidUpdate() {
    $('#location-display').locationpicker({
      radius: this.state.data.radius,
      location: {
        latitude: this.state.data.generalLocationLatitude,
        longitude: this.state.data.generalLocationLongitude
      },
      draggable: false
    });
  }

  render() {
    return (
      <div>
        <div className="container">
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-6">
                    <h1 id="title">Respond {this.state.data.title && ('to ' + this.state.data.title)}</h1>
                </div>
                <div className="col-sm-3"></div>
            </div>
            <div className="row">
              {!this.state.data.generalLocationLatitude && <p>Loading map...</p>}
              {this.state.data.generalLocationLatitude && <div id="location-display"></div>}
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
            <div className="row" id="response-row">
                <div className="col-sm-3"></div>
                <div className="col-sm-6">
                    <form id="response-form" onSubmit={this.submit.bind(this)}>
                        <input type="hidden" value={this.props.match.params.id} name="meetingId" />
                        <div className="form-group">
                            <label>Name</label>
                            <input name="name" className="form-control" type="text" placeholder="Name" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" className="form-control" type="text" placeholder="Email" required />
                        </div>
                        <div className="form-group">
                            <Location ref="location" />
                        </div>
                        <div className="form-group">
                            <Schedule ref="schedule" />
                        </div>
                        <div className="form-group" id="btn-container">
                            <button type="submit" className="btn btn-primary" id="submit-btn">
                                Submit response
                            </button>
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
        </div>
      </div>
    );
  }

  submit(e) {
    // Post to server
    $('#error-row').hide();

    e.preventDefault();

    var data = getFormData($('#response-form'));
    data.schedule = this.refs.schedule.value();
    data.locationPreferences = this.refs.location.value();

    $.ajax({
        type: 'POST',
        url: '/api/response/create',
        data: $.param(data)
    })
    .done(function(data) {
      $('#response-form')[0].reset();
      $('#title, #location-display').hide();
      $('#response-row').hide();
      $('#confirmation-row').fadeIn();
    })
    .fail(function(jqXhr) {
      $('#error-row').fadeIn();
    });
  }
}

export default Respond;
