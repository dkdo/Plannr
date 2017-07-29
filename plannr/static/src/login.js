import React from 'react'
import ReactDOM from 'react-dom'

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: ''
		};

		this.attemptLogin = this.attemptLogin.bind(this);
	}

	attemptLogin() {
		var loginInfo = {
			username: this.state.username,
			password: this.state.password
		};
		$.ajax({
                type: 'POST',
                url: this.props.url,
                data: loginInfo,
                datatype: 'json',
                cache: false,
                success: function(){
                    
                }.bind(this)
            })
        this.setState({username: '', password: ''});
	}

	passwordChange(event) {
		this.setState({password: event.target.value});
	}

	usernameChange(event) {
		this.setState({username: event.target.value});
	}


	render() {
		return (
			<div className="login-content-container">
				<div className="login-input-container" id="login-input-left">
					<form onSubmit={this.attemptLogin}>
						<div className="login-info-container">
							<Username usernameChange={this.usernameChange} />
							<Passwrd passwordChange={this.passwordChange} />
							<SubmitBtn />
							<div className="login-signup-link-container">
								<a href="" className="login-pwd-forgot-link" name="pwd_forget_link">Forgot your password?</a>
								<a href="" className="login-signup-link" name="signup_link">Sign Up</a>
							</div>
						</div>
					</form>
				</div>
				<div className="login-input-container">
					<div className="login-logo-container">
						<img src="" alt="LOGO"></img>
					</div>
				</div>
			</div>
		);
	}
}

class Passwrd extends React.Component {
	render() {
		return (
			<input type="password" className="login-signin-inputs" onChange={this.props.passwordChange} name="signin_pwd" placeholder="Password" required></input>
		);
	}
}

class SubmitBtn extends React.Component {
	render() {
		return (
			<button type="submit" className="btn login-connect-btn" name="connect_btn">LOGIN</button>
		);
	}
}

class Username extends React.Component {
	render() {
		return (
			<input type="text" className="login-signin-inputs active" onChange={this.props.usernameChange} name="signin_email" placeholder="Email@domain.com" required></input>
		);
	}
}


ReactDOM.render(
	React.createElement(Login, {
		url: '/login/'
	}),
	document.getElementById("login_react")
);
