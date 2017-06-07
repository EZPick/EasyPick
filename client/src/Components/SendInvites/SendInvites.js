import React, { Component } from 'react';
import './SendInvites.css';
import $ from 'jquery';

function getFormData($form){
    var unindexed_array = $form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}

class SendInvites extends Component {
  render() {
    return (
      <div>
        <p>Or we can invite people by email. Just enter their emails below.</p>
        <form id="invite-form" onSubmit={this.submit.bind(this)}>
          <input type="hidden" name="id" value={this.props.meetingCode} />
          <div className="form-group">
            <label>Emails</label>
            <input name="emails" className="form-control" type="text" placeholder="Type the emails you want to invite (comma separated)" required />
          </div>
          <div className="form-group" id="btn-container">
            <button type="submit" className="btn btn-primary" id="submit-btn" alt="button to submit invite form">Invite</button>
          </div>
        </form>
        <div className="row" id="confirmation-row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6">
            <div className="alert alert-success fade in">
              <strong>Invitation sent!</strong>
            </div>
          </div>
          <div className="col-sm-3"></div>
        </div>
        <div className="row" id="error-row">
          <div className="col-sm-3"></div>
          <div className="col-sm-6">
            <div className="alert alert-danger fade in">
              <strong>Invitation failed!</strong> Please try again
                  </div>
          </div>
          <div className="col-sm-3"></div>
        </div>
      </div>
    );
  }

  submit(e) {
    // Post creation data to server
      $('#error-row').hide();

    e.preventDefault();

    var data = getFormData($('#invite-form'));
    data.emails = data.emails.split(',');

    $.ajax({
        type: 'POST',
        url: '/api/meeting/invite',
        data: $.param(data)
    })
    .done(function(data) {
      $('#invite-form')[0].reset();
      $('#title').hide();
      $('#response-row').hide();
      $('#confirmation-row').fadeIn();
    })
    .fail(function(jqXhr) {
      $('#error-row').fadeIn();
    });
  }
}

export default SendInvites;
