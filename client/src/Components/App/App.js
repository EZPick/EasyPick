import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  //Link
} from 'react-router-dom';
import Home from '../Home/Home';
import Create from '../Create/Create';
import Respond from '../Respond/Respond';
import Meeting from '../Meeting/Meeting';
import Location from '../Location/Location';
import './App.css';

class App extends Component {
  componentDidMount() {
    fetch('/api/meeting/1')
      .then(res => res.json())
      .then(meeting => this.setState({ meeting }));
  }

  render() {
    return (
      <Router className="App">
        <div>
          <Route exact path="/" component={Home}/>
          <Route exact path="/create" component={Create}/>
          <Route path="/respond/:id" component={Respond}/>
          <Route path="/meeting/:id" component={Meeting}/>
          <Route path="/location" component={Location}/>
        </div>
      </Router>
    );
  }
}

export default App;
