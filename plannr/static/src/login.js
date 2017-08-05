import React from 'react'
import ReactDOM from 'react-dom'

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			showSignupForm: false,
		};

		this.attemptLogin = this.attemptLogin.bind(this);
		this.passwordChange = this.passwordChange.bind(this);
		this.signupFormAppear = this.signupFormAppear.bind(this);
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
	}

	signupFormAppear() {
		console.log('caca');
		this.setState({showSignupForm: true});
		console.log(this.state.showSignupForm);
	}

	usernameChange(event) {
		this.setState({username: event.target.value});
	}


	render() {
		return (
			<div className="login-content-container">
				<form onSubmit={this.attemptLogin} className="login-input-container" id="login-input-left">
						<div className="login-info-container">
							<img src="" alt="LOGO" className="logo-resize"></img>
							<Username usernameChange={this.usernameChange} />
							<Passwrd passwordChange={this.passwordChange} />
							<SubmitBtn />
							<div className="login-signup-link-container">
								<p className="login-pwd-forgot-link login-links" name="pwd_forget_link">Forgot your password?</p>
								<p className="login-signup-link login-links" onClick={this.signupFormAppear} name="signup_link">Sign Up</p>
							</div>
						</div>
				</form>
				<Signup showForm={this.state.showSignupForm} />
			</div>
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
			show: props.showForm
		};

		this.attemptSignup = this.attemptSignup.bind(this);
	}

	attemptSignup() {
		var signupInfo = {
			firstname: this.state.firstname,
			lastname: this.state.lastname,
			email: this.state.email,
			password: this.state.password,
			organization: this.state.organization
		};
		$.ajax({
			type: 'POST',
			url: this.props.signup_url,
			data: signupInfo,
			datatype: 'json',
			cache: false,
			success: function(){
				alert("SUCCESS!");
				this.setState({show: false});
			}.bind(this),
			error: function(){

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
					<div className={this.state.show ? "login-signup-container" : "login-signup-container hidden"}>
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
			<input type="text" className="login-page-inputs" name="signup_firstname" placeholder="First Name" required></input>
		);
	}
}

class SignupLastName extends React.Component {
	render() {
		return (
			<input type="text" className="login-page-inputs" name="signup_lastname" placeholder="Last Name" required></input>
		);
	}
}

class SignupEmail extends React.Component {
	render() {
		return (
			<input type="text" className="login-page-inputs" name="signup_email" placeholder="Email / Username" required></input>
		);
	}
}

class SignupPassword extends React.Component {
	render() {
		return (
			<input type="password" className="login-page-inputs" name="signup_password" placeholder="New Password" required></input>
		);
	}
}

class SignupOrganization extends React.Component {
	render() {
		return (
			<input type="text" className="login-page-inputs" name="signup_organization" placeholder="Organization"></input>
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
	React.createElement(Login, {
		url: '/login/',
		submit_url: '/login/?loginaction/',
		signup_url: 'login/?signupaction/'
	}),
	document.getElementById("login_react")
);
