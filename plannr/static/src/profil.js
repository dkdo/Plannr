import React from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from './shared/csrf';

class MasterProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			logged_in: '',
		};

	}

	componentWillMount() {
		this.loadUsername();
	}

	loadUsername() {
		$.ajax({
            url: this.props.loadUsername_url,
            datatype: 'json',
            cache: false,
            success: function(data){
                this.setState(data);
            }.bind(this)
        })
	}

	render() {
		return (
			<div className="profile-container">
				<div className="profile-content-container">
					<UserInformation saveprofile_url={this.props.saveprofile_url} logged_in={this.state.logged_in}/>
				</div>
			</div>
		);
	}
}

MasterProfile.defaultProps = {
	saveprofile_url: '/profil/profileInfo/',
	loadUsername_url: '/profil/user/',
};

// class PictureUpload extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {};
// 	}

// 	render() {
// 		return (
// 			<div className="profile-sub-container" id="profile_picture">
// 				<span>PICTURE</span>
// 			</div>
// 		);
// 	}
// }

class UserInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
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
				}
			}.bind(this)
		})
	}

	getCookie(name) {
	    var cookieValue = null;
	    if (document.cookie && document.cookie != '') {
	        var cookies = document.cookie.split(';');
	        for (var i = 0; i < cookies.length; i++) {
	            var cookie = jQuery.trim(cookies[i]);
	            // Does this cookie string begin with the name we want?
	            if (cookie.substring(0, name.length + 1) == (name + '=')) {
	                cookieValue = decodeURIComponent(
	                  cookie.substring(name.length + 1)
	                  );
	                break;
	            }
	        }
	    }
	    return cookieValue;
  	}

	saveProfileInfo(event) {
		if(this.state.fname == '') {
			alert("Need to add first name");
		}
		else {
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
			var csrfToken = this.getCookie('csrftoken');
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
					alert("Successfully saved the information");
				}.bind(this),
				error: function() {
					alert("Saving Profile Info Failed");
				}.bind(this)
			})
			event.preventDefault();
		}
	}

	handleInfoChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	render() {
		return (
			<form onSubmit={this.saveProfileInfo} className="profile-sub-container" id="profile_form">
				<h1>{this.props.logged_in}</h1>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>FirstName </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.first_name} name="first_name" type='text' id='user_info_fname' placeholder='John'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>LastName </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.last_name} name="last_name" type='text' id='user_info_lname' placeholder='Doe'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Email </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.email} name="email" type='text' id='user_info_email' placeholder='john.doe@example.ca'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Phone </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.phone_num} name="phone_num" type='text' id='user_info_phone' placeholder='111-222-3333'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Birth Date </span>
  					<input className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.birth_date} name="birth_date" type='text' id='user_info_bday' placeholder='YYYY/MM/DD'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Status </span>
  					<textarea className='user-info-input form-control' onChange={this.handleInfoChange} value={this.state.status} name="status" type='text' id='user_info_status' placeholder='You can write your status here...'></textarea>
				</div>
				<button type="submit" className="user-info-input-btn btn" id="user_info_btn">Save</button>
			</form>
		);
	}
}

export default MasterProfile