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
				<div className="profile-content-container">
					<h1>USERNAME</h1>
					<PictureUpload />
					<UserInformation />
				</div>
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
			<div className="profile-sub-container" id="profile_picture">
				<span>PICTURE</span>
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
			<form className="profile-sub-container" id="profile_form">
				<DjangoCSRFToken />
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>FirstName </span>
  					<input className='user-info-input form-control' type='text' id='user_info_fname'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>LastName </span>
  					<input className='user-info-input form-control' type='text' id='user_info_lname'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Email </span>
  					<input className='user-info-input form-control' type='text' id='user_info_email'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Phone </span>
  					<input className='user-info-input form-control' type='text' id='user_info_phone'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Birth Date </span>
  					<input className='user-info-input form-control' type='text' id='user_info_bday'></input>
				</div>
				<div className='input-group user-info-group'>
  					<span className='user-info-label input-group-addon'>Status </span>
  					<textarea className='user-info-input form-control' type='text' id='user_info_status'></textarea>
				</div>
				<button type="submit" className="user-info-input-btn" id="user_info_btn">Save</button>
			</form>
		);
	}
}

ReactDOM.render(     
  <MasterProfile />,
  document.getElementById('temp-profile')        
);