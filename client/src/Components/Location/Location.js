import React, { Component } from 'react';
import './Location.css';

class Location extends Component {

  constructor(props) {
    super(props);
    this.state = {coffee: '', tea: '', fastFood: '', quiet: '', sitDown: '', library: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({coffee: event.target.coffee});
    this.setState({tea: event.target.tea});
    this.setState({fastFood: event.target.fastFood});
    this.setState({quiet: event.target.quiet});
    this.setState({library: event.target.library});
    this.setState({sitDown: event.target.sitDown});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.coffee);
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Wifi: <input id="wifi" type="checkbox" value={this.state.wifi} onChange={this.handleChange} />
          </label>
          <label>
            Privacy: <input id="privacy" type="checkbox" value={this.state.privacy} onChange={this.handleChange} />
          </label>
          <label>
            Quiet: <input id="quiet" type="checkbox" value={this.state.quiet} onChange={this.handleChange} />
          </label>
          <label>
            Food and Drink: <input id="foodAndDrink" type="checkbox" value={this.state.foodAndDrink} onChange={this.handleChange} />
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
