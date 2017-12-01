import React from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from './shared/csrf';
import { isManager } from './shared/isManager.js';
import { getCookie } from './shared/getCookie';
import '../css/rewards.css';
import AlertDismissable from './alert-dismissable.js';
import Modal from 'react-modal';
import centerModal from './shared/centerModal';

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
        showAlert: false,
        bsStyle: '',
        alertText: '',
        headline: '',
        showModal: false,
    };
    this.modalText = 'Do you wish to delete this reward?';
    this.buttonText = 'DELETE';
    this.handleRewardClick = this.handleRewardClick.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addNewReward = this.addNewReward.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.modifyReward = this.modifyReward.bind(this);
    this.searchReward = this.searchReward.bind(this);
    this.deleteReward = this.deleteReward.bind(this);
    this.crudCallback = this.crudCallback.bind(this);
    this.alertDismiss = this.alertDismiss.bind(this);

  }

  componentWillMount() {
    this.loadRewards();
  }

  crudCallback(bsStyle, alertText) {
    var headline = bsStyle === "success" ? "Success!" : "Uh oh!"
    this.setState({
        showAlert: true,
        bsStyle: bsStyle,
        alertText: alertText,
        headline: headline,
    });
  }

  alertDismiss() {
      this.setState({showAlert: false});
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
              this.crudCallback("danger", "ERROR LOADING POSITIONS");
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

  addSanitize() {
      console.log('addSanitize method');
      var isGood = true;
      if(isNaN(this.state.newPoints) || this.state.newPoints == '') {
          console.log('went into addSanitize for the points');
          isGood = false;
      }
      if(this.state.newName.length > 100 || this.state.newName.length == 0) {
          console.log('went into addSanitize for the name')
          isGood = false;
      }
      return isGood;
  }

  updateSanitize() {
      console.log('updateSanitize method');
      var isGood = true;
      if(isNaN(this.state.selectedPoints) || this.state.selectedPoints == '') {
          console.log('went into updateSanitize for the points');
          isGood = false;
      }
      if(this.state.selectedName.length > 100 || this.state.selectedName.length == 0) {
          console.log('went into updateSanitize for the name')
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

  deleteReward(event, id) {
      console.log('enters deleteReward');
      var data = {reward_id: id}
      console.log(data);
      console.log(this.props.getpos_url);
      var csrfToken = getCookie('csrftoken');
      $.ajaxSetup({
          beforeSend: function(xhr, settings) {
              xhr.setRequestHeader("X-CSRFToken", csrfToken);
          }
      });
      $.ajax({
          url: this.props.rewards_url,
          type: 'DELETE',
          datatype: 'json',
          cache: false,
          data: data,
          success: function(data){
             this.removeRewardFromList(id);
             this.setState({appearDetail: false});
             this.crudCallback("success", "Deleted reward!");
          }.bind(this)
      });
      event.preventDefault();
  }

  removeRewardFromList(id) {
      var fixed = this.state.fixedRewardList.slice(0);
      var search = this.state.rewardList.slice(0);
      for(var i = 0; i < fixed.length; i++) {
          if(fixed[i].id == id) {
              fixed.splice(i, 1);
          }
      }
      for(var j = 0; j < search.length; j++) {
          if(search[j].id == id) {
              search.splice(j, 1);
          }
      }

      this.setState({fixedRewardList: fixed, rewardList: search});
  }

  addNewReward(event) {
      var canAdd = this.addSanitize();
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
                      this.crudCallback("success", "reward has been successfully added!");
                  }
              }.bind(this),
              error: function() {
                  this.crudCallback("danger", "ERROR ADDING NEW REWARD");
              }.bind(this)
          })
      }
      else {
          this.crudCallback('danger', 'Points needs to be a number and name needs to be under 100 characters and unique');
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
      var canSave = this.updateSanitize();
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
                      this.crudCallback("success", "Reward has been succesfully updated!");
                  }
              }.bind(this),
              error: function() {
                  this.crudCallback("danger", "ERROR UPDATING REWARD");
              }.bind(this)
          })
      }
      else {
         this.crudCallback('danger', 'Points needs to be a number and name needs to be under 100 characters and unique');
      }
      event.preventDefault();
  }

  render() {
    return (
        <div className="reward-content-container">
            <AlertDismissable alertVisible={this.state.showAlert} bsStyle={this.state.bsStyle} headline={this.state.headline} alertText={this.state.alertText}
                              alertDismiss={this.alertDismiss}/>
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
            rewardPoints={this.state.selectedPoints} rewardId={this.state.selectedId}
            deleteReward={this.deleteReward} modalText={this.modalText} buttonText={this.buttonText}/>
            <DisplayNewReward addNewReward={this.addNewReward} show={this.state.appearAdd} handleInputChange={this.handleInputChange}
            newName={this.state.newName} newPoints={this.state.newPoints}/>
        </div>
      </div>

    );
  }
}

class DisplayRewardInformation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    openModal(event) {
        this.setState({showModal: true});
    }

    closeModal(event) {
        this.setState({showModal: false});
    }

    onClick(event) {
        this.props.deleteReward(event, this.props.rewardId);
        this.closeModal();
    }
    render() {
        if(!this.props.show) {
            return null;
        }
        return(
            <div className="right-reward-pane-content">
                <Modal
                    isOpen={this.state.showModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Modal"
                    style={centerModal}>
                    <div>
                        <div className="modal-text">
                            {this.props.modalText}
                        </div>
                        <div className="modal-btns">
                            <button className="plannr-btn btn" onClick={this.onClick}>{this.props.buttonText}</button>
                            <button className="plannr-btn btn" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </div>
                </Modal>
                <h2 className="reward-name"> {this.props.rewardName} </h2>
                <div className="input-group reward-group">
                    <span className="input-group-addon reward-info-label">Name</span>
                    <input className="form-control reward-info-input" onChange={this.props.handleInputChange} name="selectedName" value={this.props.rewardName} placeholder="ex:Trooper"></input>
                </div>
                <div className="input-group reward-group">
                    <span className="input-group-addon reward-info-label">Points</span>
                    <input className="form-control reward-info-input" onChange={this.props.handleInputChange} name="selectedPoints" value={this.props.rewardPoints} placeholder="ex:350"></input>
                </div>
                <div className="reward-save-btn-wrapper">
                    <button onClick={this.props.modifyReward} className="reward-save-btn plannr-btn btn">SAVE</button>
                    <button onClick={this.openModal} className="reward-delete-btn plannr-btn btn">DELETE</button>
                </div>
            </div>
        );
    }
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
