import React, { Component } from 'react';
import './Location.css';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {wifi: '', privacy: '', quiet: '', foodAndDrink: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({wifi: event.target.wifi});
    this.setState({privacy: event.target.privacy});
    this.setState({quiet: event.target.quiet});
    this.setState({foodAndDrink: event.target.foodAndDrink});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.coffee);
    event.preventDefault();
  }

  render() {
    return (
      <div ref="outputDiv">
        <form ref="form" onSubmit={this.handleSubmit}>
          <label className="item">
            <input id="wifi" type="checkbox" ref="wifi" value={this.state.wifi} onChange={this.handleChange} /> Wifi
          </label>

          <label className="item">
            <input id="privacy" type="checkbox" ref="privacy" value={this.state.privacy} onChange={this.handleChange} /> Privacy
          </label>

          <label className="item">
            <input id="quiet" type="checkbox" ref="quiet" value={this.state.quiet} onChange={this.handleChange} /> Quiet
          </label>

          <label className="item">
            <input id="foodAndDrink" type="checkbox" ref="foodAndDrink" value={this.state.foodAndDrink} onChange={this.handleChange} /> Food and Drink
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }

  value() {
    // get the value
  }
}

export default Location;
