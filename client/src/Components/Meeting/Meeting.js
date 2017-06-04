import React, { Component } from 'react';
import $ from 'jquery';
import './Meeting.css';
import { Link } from 'react-router-dom';
import moment from 'moment';

class Meeting extends Component {

  constructor(props) {
    super(props);
    this.state = {data: {Responses: [], Decision: null}};
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

  formatTime(dayIndex, minutesIn) {
    var momentTime = moment()
      .day(dayIndex)
      .hours(Math.floor(minutesIn / 60))
      .minutes(minutesIn % 60);

    return momentTime.format('h:mma on dddd');
  }

  render() {
    var meeting = this.state.data;
    var decision = meeting.Decision;
    return (
      <div id='tableArea'>
        <h1>{meeting.title}</h1>
        <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>Email</th>
              </tr>
              {$.map(meeting.Responses, function(responder) {
                return (<tr key={responder['email']}>
                         <td>{responder['name']}</td>
                         <td>{responder['email']}</td>
                       </tr>);
              })}
            </tbody>
        </table>
        {decision === null &&
          <Link to={'/respond/' + this.props.match.params.id }>Respond to Meeting Here</Link>}
        {decision !== null &&
          <p>
            This meeting has been scheduled for {decision.nameOfLocation} ({decision.address}) at {this.formatTime(decision.dayOfWeek, decision.minutesIn)}.
          </p>}
      </div>
    );
  }

}


export default Meeting;
