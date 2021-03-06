import React from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from './shared/csrf';
import '../css/profil.css';
import { isPhoneValid } from './shared/isPhoneValid';
import { getCookie } from './shared/getCookie';
import {isBirthDateValid } from './shared/isBirthDateValid';
import StatsContainer from './stats.js';
import '../css/stats.css';
import EmployeeRewardsContainer from './employee-rewards.js';
import { calculateTotalPoints } from './shared/calculateTotalPoints';
import { isManager } from './shared/isManager';
import AlertDismissable from './alert-dismissable.js';

class MasterProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            hours: 0,
            taken_shifts: 0,
            given_shifts: 0,
			total_points: 0,
			total_shifts: 0,
            isManager: false,
            showAlert: false,
			bsStyle: '',
			alertText: '',
			headline: '',
        };
        this.alertDismiss = this.alertDismiss.bind(this);
        this.saveCallback = this.saveCallback.bind(this);
	}

	componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
        if(!this.state.isManager) {
            this.getStats();
        }
    }

	getStats() {
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        var data = {};
        $.ajax({
            type: 'PATCH',
            url: this.props.getStats_url,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                if(data != '') {
                    console.log(data);
					var points = calculateTotalPoints(data.hours, data.taken_shifts, data.given_shifts);
					var setData = {
						hours: data.hours,
			            taken_shifts: data.taken_shifts,
			            given_shifts: data.given_shifts,
						total_shifts: data.shifts,
						total_points: points,
					};
					this.setState(setData);
                }
            }.bind(this),
            error: function() {
                alert("something went wrong with the stats");
            }.bind(this)
        })
    }


    saveCallback(bsStyle, alertText) {
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

	render() {
		return (
			<div className="profile-container">
				<AlertDismissable alertVisible={this.state.showAlert} bsStyle={this.state.bsStyle} headline={this.state.headline} alertText={this.state.alertText}
                                  alertDismiss={this.alertDismiss}/>
				<div className="profile-content-container">
					{!this.state.isManager ? <StatsContainer hours={this.state.hours} taken={this.state.taken_shifts} given={this.state.given_shifts} total_points={this.state.total_points} all_shifts={this.state.total_shifts} /> : null}
					<UserInformation saveprofile_url={this.props.saveprofile_url} saveCallback={this.saveCallback}/>
					{!this.state.isManager ? <EmployeeRewardsContainer total_points={this.state.total_points} /> : null}
				</div>
			</div>
		);
	}
}

MasterProfile.defaultProps = {
	saveprofile_url: '/profil/profileInfo/',
	loadUsername_url: '/profil/user/',
	getStats_url: '/stats/stat_list/',
};

class UserInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			fixed_first_name: '',
			first_name: '',
			last_name: '',
			email: '',
			phone_num: '',
			birth_date: '',
			status: '',

		};

		this.handleInfoChange = this.handleInfoChange.bind(this);
		this.saveProfileInfo = this.saveProfileInfo.bind(this);

	}

	componentWillMount() {
		this.loadProfileInfo();
	}

	loadProfileInfo() {
		$.ajax({
			url: this.props.saveprofile_url,
			datatype: 'json',
			cache: false,
			success: function(data) {
				console.log(JSON.stringify(data));
				if(data != "") {
					this.setState(data);
					this.setState({fixed_first_name: this.state.first_name});
				}
			}.bind(this),
			error: function() {
				console.log('This is an Unauthorized User');
			}.bind(this)
		})
	}

	inputValidation() {
		var err_msg = 'Error saving due to these errors:\n';
		var i = 1;
		var valid = true;
		if (this.state.phone_num != '') {
			var isNumValid = isPhoneValid(this.state.phone_num);
			console.log(this.state.phone_num);
			console.log('isValid: ' + isNumValid);
			if (!isNumValid) {
				valid = false;
				err_msg += i + '. Phone Number needs to have XXX-XXX-XXXX or XXXYYYZZZZ format\n';
				i++;
			}
		}
		if (this.state.birth_date != '') {
			var isDateValid = isBirthDateValid(this.state.birth_date);
			if (!isDateValid) {
				valid = false;
				err_msg += i + '. Birth Date needs to have YYYY/MM/DD format\n';
				i++;
			}
		}
		if (this.state.first_name == '') {
			valid = false;
			err_msg += i + '. First Name cannot be empty !';
			i++;
		}
		var validObj = {
			isValid: valid,
			msg: err_msg
		};
		return validObj;
	}

	saveProfileInfo(event) {
		var validObj = this.inputValidation();
		if(validObj.isValid) {
			console.log('Went into saveProfileInfo');
			var info = {
				first_name: this.state.first_name,
				last_name: this.state.last_name,
				email: this.state.email,
				phone_num: this.state.phone_num,
				birth_date: this.state.birth_date,
				status: this.state.status,
			};
			console.log('saved info is: ' + JSON.stringify(info));
			var csrfToken = getCookie('csrftoken');
			$.ajaxSetup({
	            beforeSend: function(xhr, settings) {
	                xhr.setRequestHeader("X-CSRFToken", csrfToken);
	            }
	        });
			$.ajax({
				type: 'POST',
				url: this.props.saveprofile_url,
				data: info,
				datatype: 'json',
				success: function() {
					this.props.saveCallback("success", "Successfully saved the information!");
				}.bind(this),
				error: function() {
					this.props.saveCallback("danger", "Saving Profile Info Failed");
				}.bind(this)
			})
		}
		else {
			this.props.saveCallback("danger", validObj.msg);
		}
		event.preventDefault();
	}

	handleInfoChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	render() {
		return (
			<form onSubmit={this.saveProfileInfo} className="profile-sub-container col-sm-5" id="profile_form">
				<h1>{this.state.fixed_first_name}&#39;s Profile</h1>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>First Name </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.first_name} name="first_name" type='text' id='user_info_fname' placeholder='John'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Last Name </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.last_name} name="last_name" type='text' id='user_info_lname' placeholder='Doe'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Email </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.email} name="email" type='text' id='user_info_email' placeholder='john.doe@example.ca'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Phone </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.phone_num} name="phone_num" type='text' id='user_info_phone' placeholder='111-222-3333 or 1112223333'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Birth Date </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.birth_date} name="birth_date" type='text' id='user_info_bday' placeholder='YYYY/MM/DD'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Status </span>
  					<textarea maxLength="140" className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.status} name="status" type='text' id='user_info_status' placeholder='Out of Town for the weekend...140 characters max'></textarea>
				</div>
				<button type="submit" className="user-info-input-btn plannr-btn btn" id="user_info_btn">Save</button>
			</form>
		);
	}
}

export default MasterProfile
