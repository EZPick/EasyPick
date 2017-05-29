import React, { Component } from 'react';
import './Respond.css';
import Schedule from '../Schedule/Schedule';
import Location from '../Location/Location';
import $ from 'jquery';

class Respond extends Component {
  render() {
    return (
      <div>
        <div className="container">
            <div className="row">
                <div className="col-sm-3"></div>
                <div className="col-sm-6">
                    <h1 id="title">Respond</h1>
                </div>
                <div className="col-sm-3"></div>
            </div>
            <div className="row" id="response-row">
                <div className="col-sm-3"></div>
                <div className="col-sm-6">
                    <form id="response-form" onSubmit={this.submit}>
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
                            <Location />
                        </div>
                        <div className="form-group">
                            <Schedule />
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

  submit(e) {
    // Post to server
      $('#error-row').hide();

      e.preventDefault();

      let form = $('#response-form');

      $.ajax({
          type: 'POST',
          url: '/api/response/create',
          data: form.serialize()
      })
      .done(function(data) {
          $('#response-form')[0].reset();
          $('#title').hide();
          $('#response-row').hide();
          $('#confirmation-row').fadeIn();
      })
      .fail(function(jqXhr) {
          $('#error-row').fadeIn();
      });
  }
}

export default Respond;
