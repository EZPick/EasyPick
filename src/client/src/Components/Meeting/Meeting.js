import React, { Component } from 'react';
import $ from 'jquery';
import './Meeting.css';

class Meeting extends Component {

	getInitialState: function() {
		return {
			data: []
		},
	},

	getData: function() {
		$.ajax({
			url: '/api/meeting/get/?id=' + this.props.params.id;
			dataType: 'json',
			cacheL false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
				error: function(xhr, status, err) {
					console.error(this.props.url, status, err.toString());
				}.bind(this)
		});
	},

  render() {
    return (
      <div>
        <h1>Meeting : </h1>
				{var table = $('<table></table>')}
				{var HeaderRow = $('<tr></tr>')}
				{var NameHeader = $('<th>Name</th>')}
				{var EmailHeader = $('<th>Email</th>')}
				{NameHeader.append(HeaderRow)}
				{EmailHeader.append(HeaderRow)}
				{HeaderRow.append(table)}
				{// loop through data }
					{var row = $('<tr></tr>')}
					{var name = $('<th></th>')}
					{var email = $('<th></th>')}
					{name.append(row)}
					{email.append(row)}
					{row.append(table)}
				{// end loop}
				<a href="">Put a Link Here</a>
      </div>
    );
  },

  componentDidMount() {	
	  this.getData();
	}
}


export default Meeting;
