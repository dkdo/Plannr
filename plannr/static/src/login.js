import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, withRouter } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import DjangoCSRFToken from './shared/csrf';
import AlertDismissable from './alert-dismissable.js';

const history = createBrowserHistory({forceRefresh:true});

class MasterLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showSignup: false,
	        showAlert: false,
	        bsStyle: '',
	        alertText: '',
	        headline: '',
		};

		this.showSignUp = this.showSignUp.bind(this);
		this.hideSignUp = this.hideSignUp.bind(this);
		this.crudCallback = this.crudCallback.bind(this);
		this.alertDismiss = this.alertDismiss.bind(this);
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

	showSignUp() {
		this.setState({showSignup: true});
	}

	hideSignUp() {
		this.setState({showSignup: false});
	}

	render() {
		return (
			<div className="login-main-container">
				<AlertDismissable alertVisible={this.state.showAlert} bsStyle={this.state.bsStyle} headline={this.state.headline} alertText={this.state.alertText}
	                              alertDismiss={this.alertDismiss}/>
				<div className="login-content-container">
					<Login show={this.showSignUp} submit_url={this.props.submit_url}/>
					{this.state.showSignup ? <Signup hideSignUp={this.hideSignUp} signup_url={this.props.signup_url} hideSignUp={this.hideSignUp} crudCallback={this.crudCallback}/> : null}
				</div>
			</div>
		);
	}
}

MasterLogin.defaultProps = {
	submit_url: 'loginaction/',
	signup_url: 'signupaction/'
};

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		};

		this.attemptLogin = this.attemptLogin.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	attemptLogin(event) {
		var loginInfo = {
			username: this.state.username,
			password: this.state.password
		};
		$.ajax({
                type: 'POST',
                url: this.props.submit_url,
                data: loginInfo,
                datatype: 'json',
                cache: false,
                success: function(){
					history.push('/');
                }.bind(this),
            })
        this.setState({username: '', password: ''});
        event.preventDefault();
	}

	handleInputChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}


	render() {
		return (
				<form onSubmit={this.attemptLogin} className="login-input-container" id="login-input-left">
					<DjangoCSRFToken />
					<div className="login-info-container">
						<img src="/static/plannr_logo.png" alt="LOGO" className="logo-resize"></img>
						<input value={this.state.username} type="text" className="login-page-inputs" onChange={this.handleInputChange} name="username" placeholder="Email@domain.com" required></input>
						<input value={this.state.password} type="password" className="login-page-inputs" onChange={this.handleInputChange} name="password" placeholder="Password" required></input>
						<button type="submit" className="btn login-page-btn" name="connect_btn">LOGIN</button>
						<div className="login-signup-link-container">
							<p className="login-pwd-forgot-link login-links" name="pwd_forget_link">Forgot your password?</p>
							<p className="login-signup-link login-links" onClick={this.props.show} name="signup_link">Sign Up</p>
						</div>
					</div>
				</form>
		);
	}
}

class Signup extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			email: '',
			spassword: '',
			organization: '',
		};

		this.attemptSignup = this.attemptSignup.bind(this);
		this.handleInputChange = this.handleInputChange.bind(this);
	}



	attemptSignup(event) {
		var signupInfo = {
			firstname: this.state.firstname,
			lastname: this.state.lastname,
			email: this.state.email,
			password: this.state.spassword,
			organization: this.state.organization
		};
		$.ajax({
			type: 'POST',
			url: this.props.signup_url,
			data: signupInfo,
			datatype: 'json',
			cache: false,
			success: function(data){
				console.log(data);
				this.setState({firstname: '', lastname: '', email: '', spassword: '', organization: ''});
				this.props.crudCallback("success", "Successfully signed up!");
				this.props.hideSignUp();
			}.bind(this),
			error: function(data){
				console.log(data.responseJSON);
				this.props.crudCallback("danger", JSON.parse(data.responseJSON).message);
			}.bind(this)
		})
		event.preventDefault();
	}

	handleInputChange(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	render() {
		return (
				<form onSubmit={this.attemptSignup} className="login-input-container">
					<DjangoCSRFToken />
					<div className="login-signup-container">
						<h1 className="login-signup-title">SIGN UP</h1>
						<input value={this.state.firstname} type="text" className="login-page-inputs" onChange={this.handleInputChange} name="firstname" placeholder="First Name" required></input>
						<input value={this.state.lastname} type="text" className="login-page-inputs" onChange={this.handleInputChange} name="lastname" placeholder="Last Name" required></input>
						<input value={this.state.email} type="text" className="login-page-inputs" onChange={this.handleInputChange} name="email" placeholder="Email / Username" required></input>
						<input value={this.state.spassword} type="password" className="login-page-inputs" onChange={this.handleInputChange} name="spassword" placeholder="New Password" required></input>
						<input value={this.state.organization} type="text" className="login-page-inputs" onChange={this.handleInputChange} name="organization" placeholder="Organization"></input>
						<button type="submit" className="btn login-page-btn" name="signup_btn">SIGN UP</button>
					</div>
				</form>
		);
	}
}

export default MasterLogin
