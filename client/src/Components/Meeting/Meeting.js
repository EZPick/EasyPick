import React, { Component } from 'react';
import $ from 'jquery';
import './Meeting.css';
import { Link } from 'react-router-dom';

class Meeting extends Component {

	constructor(props) {
		super(props);
		this.state = {data: {Responses: []}};
		$.ajax({
					url: '/api/meeting/get/?id=1',
					dataType: 'json',
					cacheL: false,
					success: function(data) {
						this.setState({data: data.data });
					}.bind(this),
						error: function(xhr, status, err) {
								console.log("SOI SOI SOI SOI ERROR");
								return err;
						}
		 });

	}


  render() {
    return (
      <div id='tableArea'>
        <h1>Meeting : </h1>
				<table>
						<tbody>
							<tr>
								<th> Name </th>
								<th> Email </th>
							</tr>
							{$.map(this.state.data.Responses, function(responder) { 
								return (<tr key={responder['email']}> 
												 <td>{responder['name']}</td> 
												 <td>{responder['email']}</td>
											 </tr>);
							})}
						</tbody>
				</table>
				<Link to={'/respond/' + this.props.match.params.id }>Respond to Meeting Here</Link>
      </div>
    );
  }

}


export default Meeting;
