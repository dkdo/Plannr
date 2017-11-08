import React from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from './shared/csrf';
import { getCookie } from './shared/csrf_methods';

export default class MasterPosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };

  }

  render() {
    return (
      <div className="position-content-container">
        <Position getpos_url={this.props.getPositions_url}/>
      </div>

    );
  }
}

MasterPosition.defaultProps = {
    getPositions_url : '/position/positionList/',
};

class Position extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        positionList : [],
        selectedId: 0,
        selectedTitle: 'POSITION',
        selectedSalary: -1,
        selectedDep: '',
        appearDetail: false,
        newTitle: '',
        newSalary: '',
        newDep: '',
        appearAdd: false,
    };
    this.handlePositionClick = this.handlePositionClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewPosition = this.addNewPosition.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);

  }

  componentWillMount() {
    this.loadPositions();
  }

  loadPositions() {
      $.ajax({
          type: 'GET',
          url: this.props.getpos_url,
          datatype: 'json',
          cache: false,
          success: function(data){
              console.log(JSON.stringify(data));
              if(!(data == "" || data == [])) {
                  console.log("updating positionList");
                  this.setState({positionList: data});
              }
          }.bind(this),
          error: function() {
              alert("ERROR LOADING POSITIONS");
          }.bind(this)
      })
  }

  handlePositionClick(event) {
      //if the one clicked is not the same as the one being viewed right now
      if (event.target.id != this.state.selectedId) {
          var positions = this.state.positionList;
          for (var i = 0; i < positions.length; i++) {
              var pos = positions[i];
              if (pos.id == event.target.id) {
                  this.setState({
                      selectedId: pos.id,
                      selectedTitle: pos.title,
                      selectedSalary: pos.salary,
                      selectedDep: pos.department,
                      appearDetail: true,
                      appearAdd:false,
                  });
              }
          }
      }
      //if it's the same, close it.
      else {
          this.setState({appearDetail: !(this.state.appearDetail), appearAdd: false});
      }
  }

  handleAddClick(event) {
      this.setState({
          appearDetail: false,
          appearAdd: true,
      })
  }

  handleInputChange(event) {
      this.setState({
          [event.target.name]: event.target.value,
      })
  }

  addNewPosition(event) {
      var inData = {
          title: this.state.newTitle,
          salary: this.state.newSalary,
          department: this.state.newDep
      }
      var csrfToken = getCookie('csrftoken');
      $.ajaxSetup({
          beforeSend: function(xhr, settings) {
              xhr.setRequestHeader("X-CSRFToken", csrfToken);
          }
      });
      $.ajax({
          type: 'POST',
          url: this.props.getpos_url,
          datatype: 'json',
          data: inData,
          cache: false,
          success: function(data){
              if(data != "") {
                  var positions = this.state.positionList;
                  positions.push(data);
                  this.setState({positionList: positions});
              }
          }.bind(this),
          error: function() {
              alert("ERROR ADDING NEW POSITION");
          }.bind(this)
      })
      event.preventDefault();
  }

  render() {
    return (
        <div className="position-content-container">
            <div className="position-pane" id="left_position_pane">
                <button onClick={this.handleAddClick} className="position-add-btn plannr-btn btn">ADD</button>
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
                    <button type="button" onClick={this.handlePositionClick} className="list-group-item" id={position.id} key={position.id}>{position.title}</button>))}
                </div>
            </div>
        <div className="position-pane" id="right_position_pane">
        <DisplayInformation show={this.state.appearDetail} handleInputChange={this.handleInputChange}
        posId={this.state.selectedId} posTitle={this.state.selectedTitle}
        posSalary={this.state.selectedSalary} posDep={this.state.selectedDep}/>
        <DisplayNewPosition addNewPosition={this.addNewPosition} show={this.state.appearAdd} handleInputChange={this.handleInputChange}
        newTitle={this.state.newTitle} newSalary={this.state.newSalary}
        newDep={this.state.newDep}/>
        </div>
      </div>

    );
  }
}

function DisplayInformation(props) {
    if(!props.show) {
        return null;
    }
    return(
        <form className="right-position-pane-content">
            <h2 className="position-title"> {props.posTitle} </h2>
            <div className="position-group">
                <span className="position-info-label">Hourly Salary:</span>
                <input onChange={props.handleInputChange} name="selectedSalary" value={props.posSalary} className="position-info-input" placeholder="ex:13$"></input>
            </div>
            <div className="position-group">
                <span className="position-info-label">Department:</span>
                <input onChange={props.handleInputChange} name="positionDep" value={props.posDep} className="position-info-input" placeholder="Customer Service"></input>
            </div>
            <div className="position-save-btn-wrapper">
                <button className="position-save-btn plannr-btn btn">SAVE</button>
            </div>
        </form>
    );
}

function DisplayNewPosition(props) {
    if(!props.show) {
        return null;
    }
    return(
        <form className="right-position-pane-content">
            <h2 className="position-title">NEW POSITION</h2>
            <div className="position-group">
                <span className="position-info-label">Title:</span>
                <input onChange={props.handleInputChange} name="newTitle" value={props.newTitle} className="position-info-input" placeholder="ex:Cashier"></input>
            </div>
            <div className="position-group">
                <span className="position-info-label">Hourly Salary:</span>
                <input onChange={props.handleInputChange} name="newSalary" value={props.newSalary} className="position-info-input" placeholder="ex:13$"></input>
            </div>
            <div className="position-group">
                <span className="position-info-label">Department:</span>
                <input onChange={props.handleInputChange} name="newDep" value={props.newDep} className="position-info-input" placeholder="Customer Service"></input>
            </div>
            <div className="position-save-btn-wrapper">
                <button onClick={props.addNewPosition} className="position-save-btn plannr-btn btn">ADD NEW</button>
            </div>
        </form>
    )
}
