import React from 'react'
import ReactDOM from 'react-dom'

class DjangoCSRFToken extends React.Component{
	constructor(props) {
		super(props);
		this.state = {};
		this.getCookie = this.getCookie.bind(this);
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

	render() {
		var csrfToken = this.getCookie('csrftoken');
		return (
			<input type="hidden" name="csrfmiddlewaretoken" value={csrfToken}></input>
    	);
  	}
}

class MasterLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showSignup: false,
		};

		this.showSignUp = this.showSignUp.bind(this);
	}

	showSignUp() {
		this.setState({showSignup: true});
	}

	hideSignUp() {
		this.setState({showSignup: false});
	}

	render() {
		return (
			<div className="login-content-container">
				<Login show={this.showSignUp} submit_url={this.props.submit_url}/>
				{this.state.showSignup ? <Signup hide={this.hideSignUp} signup_url={this.props.signup_url}/> : null}
			</div>
		);
	}
}

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
		};

		this.attemptLogin = this.attemptLogin.bind(this);
		this.passwordChange = this.passwordChange.bind(this);
		this.usernameChange = this.usernameChange.bind(this);
	}

	attemptLogin() {
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
                    alert("Success!");
                }.bind(this),
                error: function(){
                	alert("Failed!")
                }.bind(this)
            })
        this.setState({username: '', password: ''});
	}

	passwordChange(event) {
		this.setState({password: event.target.value});
		console.log('changed !');
	}

	usernameChange(event) {
		this.setState({username: event.target.value});
		console.log('changed !');
	}


	render() {
		return (
				<form onSubmit={this.attemptLogin} className="login-input-container" id="login-input-left">
					<div className="login-info-container">
						<img src="" alt="LOGO" className="logo-resize"></img>
						<Username usernameChange={this.usernameChange} />
						<Passwrd passwordChange={this.passwordChange} />
						<SubmitBtn />
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
			password: '',
			organization: '',
		};

		this.attemptSignup = this.attemptSignup.bind(this);
		this.firstnameChange = this.firstnameChange.bind(this);
		this.lastnameChange = this.lastnameChange.bind(this);
		this.emailChange = this.emailChange.bind(this);
		this.spasswordChange = this.spasswordChange.bind(this);
		this.organizationChange = this.organizationChange.bind(this);
	}

	attemptSignup(event) {
		event.preventDefault();
		var signupInfo = {
			firstname: this.state.firstname,
			lastname: this.state.lastname,
			email: this.state.email,
			password: this.state.password,
			organization: this.state.organization
		};
		console.log(signupInfo);
		$.ajax({
			type: 'POST',
			url: this.props.signup_url,
			data: signupInfo,
			datatype: 'json',
			cache: false,
			success: function(){
				console.log("SUCCESS!");
				this.props.hide;
			}.bind(this),
			error: function(jqXHR, exception){
				console.log("FAILED!");
				console.log("info is " + JSON.stringify(signupInfo));
		        var msg = '';
		        if (jqXHR.status === 0) {
		            msg = 'Not connected.\nVerify Network.\n' + jqXHR.responseText;
		        } else if (jqXHR.status == 404) {
		            msg = 'Requested page not found. [404]';
		        } else if (jqXHR.status == 500) {
		            msg = 'Internal Server Error [500].';
		        } else if (exception === 'parsererror') {
		            msg = 'Requested JSON parse failed.';
		        } else if (exception === 'timeout') {
		            msg = 'Time out error.';
		        } else if (exception === 'abort') {
		            msg = 'Ajax request aborted.';
		        } else {
		            msg = 'Uncaught Error.\n' + jqXHR.responseText;
		        }
		        console.log(msg);
			}
		})
	}

	firstnameChange(event) {
		this.setState({firstname: event.target.value});
	}

	lastnameChange(event) {
		this.setState({lastname: event.target.value});
	}

	emailChange(event) {
		this.setState({email: event.target.value});
	}

	spasswordChange(event) {
		this.setState({password: event.target.value});
	}

	organizationChange(event) {
		this.setState({organization: event.target.value});
	}

	render() {
		return (
				<form onSubmit={this.attemptSignup} className="login-input-container">
					<DjangoCSRFToken />
					<div className="login-signup-container">
						<h1 className="login-signup-title">SIGN UP</h1>
						<SignupFirstName firstnameChange={this.firstnameChange} />
						<SignupLastName lastnameChange={this.lastnameChange} />
						<SignupEmail emailChange={this.emailChange} />
						<SignupPassword spasswordChange={this.spasswordChange} />
						<SignupOrganization organizationChange={this.organizationChange} />
						<SignupBtn />
					</div>
				</form>
		);
	}
}

class Passwrd extends React.Component {
	render() {
		return (
			<input type="password" className="login-page-inputs" onChange={this.props.passwordChange} name="signin_pwd" placeholder="Password" required></input>
		);
	}
}

class SignupFirstName extends React.Component {
	render() {
		return (
			<input type="text" className="login-page-inputs" onChange={this.props.firstnameChange} name="signup_firstname" placeholder="First Name" required></input>
		);
	}
}

class SignupLastName extends React.Component {
	render() {
		return (
			<input type="text" className="login-page-inputs" onChange={this.props.lastnameChange} name="signup_lastname" placeholder="Last Name" required></input>
		);
	}
}

class SignupEmail extends React.Component {
	render() {
		return (
			<input type="text" className="login-page-inputs" onChange={this.props.emailChange} name="signup_email" placeholder="Email / Username" required></input>
		);
	}
}

class SignupPassword extends React.Component {
	render() {
		return (
			<input type="password" className="login-page-inputs" onChange={this.props.spasswordChange} name="signup_password" placeholder="New Password" required></input>
		);
	}
}

class SignupOrganization extends React.Component {
	render() {
		return (
			<input type="text" className="login-page-inputs" onChange={this.props.organizationChange} name="signup_organization" placeholder="Organization"></input>
		);
	}
}

class SignupBtn extends React.Component {
	render() {
		return (
			<button type="submit" className="btn login-page-btn" name="signup_btn">SIGN UP</button>
		);
	}
}

class SubmitBtn extends React.Component {
	render() {
		return (
			<button type="submit" className="btn login-page-btn" name="connect_btn">LOGIN</button>
		);
	}
}

class Username extends React.Component {
	render() {
		return (
			<input type="text" className="login-page-inputs" onChange={this.props.usernameChange} name="signin_email" placeholder="Email@domain.com" required></input>
		);
	}
}


ReactDOM.render(
	React.createElement(MasterLogin, {
		url: '/login/',
		submit_url: 'loginaction/',
		signup_url: 'signupaction/'
	}),
	document.getElementById("login_react")
);
