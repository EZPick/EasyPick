import React, { Component } from 'react';
import './Location.css';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {wifi: false, privacy: false, quiet: false, foodAndDrink: false};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.id]: !this.state[event.target.id]
    });
  }

  handleSubmit(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div ref="outputDiv">
        <form ref="form" onSubmit={this.handleSubmit}>
          <label className="item">
            <input id="wifi" type="checkbox" onChange={this.handleChange} /> Wifi
          </label>
          <label className="item">
            <input id="privacy" type="checkbox" onChange={this.handleChange} /> Privacy
          </label>
          <label className="item">
            <input id="quiet" type="checkbox" onChange={this.handleChange} /> Quiet
          </label>
          <label className="item">
            <input id="foodAndDrink" type="checkbox" onChange={this.handleChange} /> Food and Drink
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Location;
