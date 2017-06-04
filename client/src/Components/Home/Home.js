import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

class Home extends Component {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1>Welcome!</h1>
          <p className="lead">Welcome to EasyPick! This app will help you plan where and when to meet up with friends or classmates. You’ll set up a meeting, send out a URL, and everyone can fill out what times work for them and what type of place they want to meet. You’ll get your meeting scheduled for you, automatically!</p>
          <p>To get started, click “Create” below.</p>
          <p><Link to="/create" className="btn btn-lg btn-success" role="button">Create</Link></p>
        </div>
      </div>
    );
  }
}

export default Home;
