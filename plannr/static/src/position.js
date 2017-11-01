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
      <div className="position-content-container">
        <Position />
      </div>

    );
  }
}

class Position extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        positionList : [
            {
                id: 1,
                title: 'Bol Maker',
                salary: 11.50,
            },
            {
                id: 2,
                title: 'Runner',
                salary: 11.38,
            },
            {
                id: 3,
                title: 'Position1',
                salary: 11.50,
            },
            {
                id: 4,
                title: 'Position2',
                salary: 11.38,
            },
            {
                id: 5,
                title: 'Position3',
                salary: 11.50,
            },
            {
                id: 6,
                title: 'Position4',
                salary: 11.38,
            },
            {
                id: 7,
                title: 'Position5',
                salary: 11.50,
            },
            {
                id: 8,
                title: 'Position6',
                salary: 11.38,
            },
            {
                id: 9,
                title: 'Position7',
                salary: 11.50,
            },
            {
                id: 10,
                title: 'Position8',
                salary: 11.38,
            }
        ]
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
            <div className="position-pane" id="left_position_pane">
                <button className="position-add-btn plannr-btn btn">ADD</button>
                <div className="search-bar">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search for..."></input>
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button">Go!</button>
                        </span>
                    </div>
                </div>
                <div className="list-group">
                    {this.state.positionList.map(position => (
                    <button type="button" className="list-group-item" key={position.id}>{position.title}</button>))}
                </div>
            </div>
        <div className="position-pane" id="right_position_pane">
            <form className="right-position-pane-content">
                <h2 className="position-title"> POSITION </h2>
                <div className="position-group">
                    <span className="position-info-label">Hourly Salary:</span>
                    <input className="position-info-input" placeholder="ex:13$"></input>
                </div>
                <div className="position-group">
                    <span className="position-info-label">Department:</span>
                    <input className="position-info-input" placeholder="Customer Service"></input>
                </div>
                <div className="position-group">
                    <span className="position-info-label">Manager:</span>
                    <input className="position-info-input" placeholder="Bob TheBuilder"></input>
                </div>
                <div className="position-save-btn-wrapper">
                    <button className="position-save-btn plannr-btn btn">SAVE</button>
                </div>
            </form>
        </div>
      </div>

    );
  }
}
