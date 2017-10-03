import React from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from './shared/csrf';

class MasterProfile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

	}

	render() {
		return (
			<div className="profile-container">
			<h1>USERNAME</h1>
			<PictureUpload />
			<UserInformation />
			</div>
		);
	}
}

class PictureUpload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="profile-picture-container">
			</div>
		);
	}
}

class UserInformation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};


	}

	render() {
		return (
			<form className="user-info-container">
				<DjangoCSRFToken />
				<label class='user-info-group' for='user_info_name'>
  					<span class='user-info-label'>Name: </span>
  					<input class='user-info-input' type='text' id='user_info_name'></input>
				</label>
				<label class='user-info-group' for='user_info_pwd'>
  					<span class='user-info-label'>Password: </span>
  					<input class='user-info-input' type='password' id='user_info_pwd'></input>
				</label>
				<label class='user-info-group' for='user_info_email'>
  					<span class='user-info-label'>Email: </span>
  					<input class='user-info-input' type='text' id='user_info_email'></input>
				</label>
				<label class='user-info-group' for='user_info_phone'>
  					<span class='user-info-label'>Phone: </span>
  					<input class='user-info-input' type='text' id='user_info_phone'></input>
				</label>
				<label class='user-info-group' for='user_info_bday'>
  					<span class='user-info-label'>Birth Date: </span>
  					<input class='user-info-input' type='text' id='user_info_bday'></input>
				</label>
				<label class='user-info-group' for='user_info_status'>
  					<span class='user-info-label'>Status: </span>
  					<textarea class='user-info-input' id='user_info_status'></textarea>
				</label>
			</form>
		);
	}
}

ReactDOM.render(     
  <MasterProfile />,
  document.getElementById('temp-profile')        
);