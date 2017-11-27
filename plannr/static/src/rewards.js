import React from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from './shared/csrf';
import { isManager } from './shared/isManager.js';
import { getCookie } from './shared/getCookie';
import '../css/rewards.css';

class MasterReward extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isManager: false,
        };
    }

    componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
    }

    render() {
        var rewardContainer = null;
        if (this.state.isManager) {
            rewardContainer = <Reward rewards_url={this.props.rewards_url}/>
        }
      return (
        <div>
          <h1 className="page-title">Rewards</h1>
          <div className="reward-content-container">
            {rewardContainer}
          </div>
        </div>

      );
    }
}

MasterReward.defaultProps = {
    rewards_url : '/rewards/rewardList/',
};

class Reward extends React.Component {
  constructor(props) {
    super(props);
    //fixedRewardList is the global one that is pulled once
    //rewardList changes depending on the search bar
    this.state = {
        fixedRewardList: [],
        rewardList : [],
        selectedId: 0,
        selectedName: 'REWARD',
        selectedPoints: -1,
        appearDetail: false,
        newName: '',
        newPoints: '',
        appearAdd: false,
        searchFilter: '',
    };
    this.handleRewardClick = this.handleRewardClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewReward = this.addNewReward.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.modifyReward = this.modifyReward.bind(this);
    this.searchReward = this.searchReward.bind(this);

  }

  componentWillMount() {
    this.loadRewards();
  }

  loadRewards() {
      $.ajax({
          type: 'GET',
          url: this.props.rewards_url,
          datatype: 'json',
          cache: false,
          success: function(data){
              if(!(data == "" || data == [])) {
                  this.setState({rewardList: data, fixedRewardList: data});
              }
          }.bind(this),
          error: function() {
              alert("ERROR LOADING REWARDS");
          }.bind(this)
      })
  }

  handleRewardClick(event) {
      //if the one clicked is not the same as the one being viewed right now
      if (event.target.id != this.state.selectedId) {
          var rewards = this.state.rewardList.slice(0);
          for (var i = 0; i < rewards.length; i++) {
              var reward = rewards[i];
              if (reward.id == event.target.id) {
                  this.setState({
                      selectedId: reward.id,
                      selectedName: reward.name,
                      selectedPoints: reward.required_points,
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

  searchReward(event) {
      var filter = this.state.searchFilter;
      var filteredRewards = [];
      var list = this.state.fixedRewardList.slice(0);
      for(var i = 0; i < list.length; i++) {
          var reward = list[i];
          if(reward.name.indexOf(filter) > -1) {
              filteredRewards.push(reward);
          }
      }
      this.setState({rewardList: filteredRewards});
  }

  sanitizeInput() {
      var isGood = true;
      if(isNaN(this.state.newPoints) || isNaN(this.state.selectedPoints) || this.state.newPoints == '') {
          isGood = false;
      }
      if(this.state.newName.length > 100 || this.state.selectedName.length > 100 || this.state.newName.length == 0) {
          isGood = false;
      }
      return isGood;
  }

  appliesToSearch(newReward) {
      var name = newReward.name;
      var filter = this.state.searchFilter;
      var doesApply = false;
      if (name.indexOf(filter) > -1) {
          doesApply = true;
      }
      return doesApply;
  }

  addNewReward(event) {
      var canAdd = this.sanitizeInput();
      if (canAdd) {
          var inData = {
              name: this.state.newName,
              required_points: this.state.newPoints,
          }
          var csrfToken = getCookie('csrftoken');
          $.ajaxSetup({
              beforeSend: function(xhr, settings) {
                  xhr.setRequestHeader("X-CSRFToken", csrfToken);
              }
          });
          $.ajax({
              type: 'POST',
              url: this.props.rewards_url,
              datatype: 'json',
              data: inData,
              cache: false,
              success: function(data){
                  if(data != "") {
                      var rewards = this.state.fixedRewardList.slice(0);
                      var filteredRewards = this.state.rewardList.slice(0);
                      rewards.push(data);
                      var putInFiltered = this.appliesToSearch(data);
                      if(putInFiltered) {
                          filteredRewards.push(data);
                      }
                      this.setState({fixedRewardList: rewards,
                      newName: '',
                      newPoints: '',
                      rewardList: filteredRewards});
                      alert('Reward has been succesfully added!')
                  }
              }.bind(this),
              error: function() {
                  alert("ERROR ADDING NEW REWARD");
              }.bind(this)
          })
      }
      else {
          alert('Points needs to be a number and name needs to be under 100 characters and unique');
      }
      event.preventDefault();
  }

  updateRewardList() {
      var rewards = this.state.rewardList.slice(0);
      if (this.state.selectedId != 0) {
          var id = this.state.selectedId;
          for(var i = 0; i < rewards.length; i++) {
              var reward = rewards[i];
              if (reward.id == id) {
                  rewards[i].required_points = this.state.selectedPoints;
                  rewards[i].name = this.state.selectedName;
              }
          }
      }
      this.setState({rewardList: rewards});
  }

  modifyReward(event) {
      var canSave = this.sanitizeInput();
      if (canSave) {
          var inData = {
              id: this.state.selectedId,
              name: this.state.selectedName,
              required_points: this.state.selectedPoints,
          }
          console.log(JSON.stringify(inData));
          var csrfToken = getCookie('csrftoken');
          $.ajaxSetup({
              beforeSend: function(xhr, settings) {
                  xhr.setRequestHeader("X-CSRFToken", csrfToken);
              }
          });
          $.ajax({
              type: 'PATCH',
              url: this.props.rewards_url,
              datatype: 'json',
              data: inData,
              cache: false,
              success: function(data){
                  if(data != "") {
                      this.updateRewardList();
                      alert('Reward has been succesfully updated!')
                  }
              }.bind(this),
              error: function() {
                  alert("ERROR UPDATING REWARD");
              }.bind(this)
          })
      }
      else {
          alert('Points needs to be a number and name needs to be under 100 characters and unique');
      }
      event.preventDefault();
  }

  render() {
    return (
        <div className="reward-content-container">
            <div className="reward-pane" id="left_reward_pane">
                <button onClick={this.handleAddClick} className="reward-add-btn plannr-btn btn">ADD</button>
                <div className="search-bar">
                    <div className="input-group">
                        <input onChange={this.handleInputChange} value={this.state.searchFilter} name="searchFilter" type="text" className="form-control" placeholder="Search for..."></input>
                        <span className="input-group-btn">
                            <button onClick={this.searchReward} className="reward-search-btn btn btn-default" type="button">Go!</button>
                        </span>
                    </div>
                </div>
                <div className="list-group">
                    {this.state.rewardList.map(reward => (
                    <button type="button" onClick={this.handleRewardClick} className="reward-list-item list-group-item" id={reward.id} key={reward.id}>{reward.name}</button>))}
                </div>
            </div>
        <div className="reward-pane" id="right_reward_pane">
            <DisplayRewardInformation modifyReward={this.modifyReward} show={this.state.appearDetail} handleInputChange={this.handleInputChange}
            rewardId={this.state.selectedId} rewardName={this.state.selectedName}
            rewardPoints={this.state.selectedPoints}/>
            <DisplayNewReward addNewReward={this.addNewReward} show={this.state.appearAdd} handleInputChange={this.handleInputChange}
            newName={this.state.newName} newPoints={this.state.newPoints}/>
        </div>
      </div>

    );
  }
}

function DisplayRewardInformation(props) {
    if(!props.show) {
        return null;
    }
    return(
        <form className="right-reward-pane-content">
            <h2 className="reward-name"> {props.rewardName} </h2>
            <div className="input-group reward-group">
                <span className="input-group-addon reward-info-label">Name</span>
                <input className="form-control reward-info-input" onChange={props.handleInputChange} name="selectedName" value={props.rewardName} placeholder="ex:Trooper"></input>
            </div>
            <div className="input-group reward-group">
                <span className="input-group-addon reward-info-label">Points</span>
                <input className="form-control reward-info-input" onChange={props.handleInputChange} name="selectedPoints" value={props.rewardPoints} placeholder="ex:350"></input>
            </div>
            <div className="reward-save-btn-wrapper">
                <button onClick={props.modifyReward} className="reward-save-btn plannr-btn btn">SAVE</button>
            </div>
        </form>
    );
}

function DisplayNewReward(props) {
    if(!props.show) {
        return null;
    }
    return(
        <form className="right-reward-pane-content">
            <h2 className="reward-name">NEW REWARD</h2>
            <div className="input-group reward-group">
                <span className="input-group-addon reward-info-label">Name</span>
                <input className="form-control reward-info-input" onChange={props.handleInputChange} name="newName" value={props.newName} placeholder="ex:Trooper"></input>
            </div>
            <div className="input-group reward-group">
                <span className="input-group-addon reward-info-label">Points</span>
                <input className="form-control reward-info-input" onChange={props.handleInputChange} name="newPoints" value={props.newPoints} placeholder="ex:350"></input>
            </div>
            <div className="reward-save-btn-wrapper">
                <button onClick={props.addNewReward} className="reward-save-btn plannr-btn btn">ADD NEW</button>
            </div>
        </form>
    )
}

export default MasterReward
