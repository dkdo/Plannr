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
    //fixedPositionList is the global one that is pulled once
    //positionList changes depending on the search bar
    this.state = {
        fixedPositionList: [],
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
        searchFilter: '',
    };
    this.handlePositionClick = this.handlePositionClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewPosition = this.addNewPosition.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.modifyPosition = this.modifyPosition.bind(this);
    this.searchPosition = this.searchPosition.bind(this);

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
              if(!(data == "" || data == [])) {
                  this.setState({positionList: data, fixedPositionList: data});
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

  searchPosition(event) {
      var filter = this.state.searchFilter;
      var filteredPositions = [];
      var list = this.state.fixedPositionList;
      for(var i = 0; i < list.length; i++) {
          var position = list[i];
          if(position.title.indexOf(filter) > -1) {
              filteredPositions.push(position);
          }
      }
      this.setState({positionList: filteredPositions});
  }

  sanitizeInput() {
      var isGood = true;
      if(isNaN(this.state.newSalary) || isNaN(this.state.selectedSalary)) {
          isGood = false;
      }
      if(this.state.newTitle.length > 100 || this.state.newDep.length > 100 || this.state.selectedDep.length > 100) {
          isGood = false;
      }
      return isGood;
  }

  appliesToSearch(newPosition) {
      var title = newPosition.title;
      var filter = this.state.searchFilter;
      var doesApply = false;
      if (title.indexOf(filter) > -1) {
          doesApply = true;
      }
      return doesApply;
  }

  addNewPosition(event) {
      var canAdd = this.sanitizeInput();
      if (canAdd) {
          var inData = {
              id: -1,
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
                      var positions = this.state.fixedPositionList;
                      var filteredPositions = this.state.positionList;
                      positions.push(data);
                      var putInFiltered = this.appliesToSearch(data);
                      if(putInFiltered) {
                          filteredPositions.push(data);
                      }
                      this.setState({fixedPositionList: positions,
                      newTitle: '', newDep: '', newSalary: '',
                      positionList: filteredPositions});
                      alert('Position has been succesfully added!')
                  }
              }.bind(this),
              error: function() {
                  alert("ERROR ADDING NEW POSITION");
              }.bind(this)
          })
      }
      else {
          alert('Salary needs to be a number and title,Department need to be under 100 characters');
      }
      event.preventDefault();
  }

  updatePositionList() {
      var positions = this.state.positionList;
      if (this.state.selectedId != 0) {
          var id = this.state.selectedId;
          for(var i = 0; i < positions.length; i++) {
              var pos = positions[i];
              if (pos.id == id) {
                  if (this.state.selectedSalary == '') {
                      this.setState({selectedSalary: 0});
                  }
                  positions[i].salary = this.state.selectedSalary;
                  positions[i].department = this.state.selectedDep;
              }
          }
      }
      this.setState({positionList: positions});
  }

  modifyPosition(event) {
      var canSave = this.sanitizeInput();
      if (canSave) {
          var inData = {
              id: this.state.selectedId,
              title: this.state.selectedTitle,
              salary: this.state.selectedSalary,
              department: this.state.selectedDep
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
                      this.updatePositionList();
                      alert('Position has been succesfully updated!')
                  }
              }.bind(this),
              error: function() {
                  alert("ERROR ADDING NEW POSITION");
              }.bind(this)
          })
      }
      else {
          alert('Salary needs to be a number and title,Department need to be under 100 characters');
      }
      event.preventDefault();
  }

  render() {
    return (
        <div className="position-content-container">
            <div className="position-pane" id="left_position_pane">
                <button onClick={this.handleAddClick} className="position-add-btn plannr-btn btn">ADD</button>
                <div className="search-bar">
                    <div className="input-group">
                        <input onChange={this.handleInputChange} value={this.state.searchFilter} name="searchFilter" type="text" className="form-control" placeholder="Search for..."></input>
                        <span className="input-group-btn">
                            <button onClick={this.searchPosition} className="btn btn-default" type="button">Go!</button>
                        </span>
                    </div>
                </div>
                <div className="list-group">
                    {this.state.positionList.map(position => (
                    <button type="button" onClick={this.handlePositionClick} className="list-group-item" id={position.id} key={position.id}>{position.title}</button>))}
                </div>
            </div>
        <div className="position-pane" id="right_position_pane">
        <DisplayInformation modifyPosition={this.modifyPosition} show={this.state.appearDetail} handleInputChange={this.handleInputChange}
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
                <input onChange={props.handleInputChange} name="selectedDep" value={props.posDep} className="position-info-input" placeholder="Customer Service"></input>
            </div>
            <div className="position-save-btn-wrapper">
                <button onClick={props.modifyPosition} className="position-save-btn plannr-btn btn">SAVE</button>
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
