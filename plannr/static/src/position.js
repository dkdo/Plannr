import React from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from './shared/csrf';

export default class MasterPosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  componentWillMount() {
  }

  render() {
    return (
      <div className="position-container">
        <Position />
      </div>

    );
  }
}

class Position extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  componentWillMount() {
    this.loadPositions();
  }

  loadPositions() {
    console.log("loading positions...");
  }

  render() {
    return (
      <div className="position-content-container">
        <div className="position-search-bar">
          <h1>THE MOST AMAZING SEARCH BAR EVER!!!</h1>
        </div>
        <div className="position-list">
          <h2> LOOK AT THIS AMAZING POSITION LIST</h2>
        </div>
      </div>

    );
  }
}
