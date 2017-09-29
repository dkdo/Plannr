import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, IndexRoute, withRouter } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import DjangoCSRFToken from './shared/csrf';

const history = createBrowserHistory({forceRefresh:true});

class MasterLogout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.attemptLogout = this.attemptLogout.bind(this);
	}

	attemptLogout(event) {
		$.ajax({
			type: 'POST',
			url: this.props.logout_url,
			data: {},
			datatype: 'json',
			cache: false,
			success: function() {
				alert("Logout Success!");
			}.bind(this)
		})
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.attemptLogout} className="logout-link-form" id="logout_form"> 
				<DjangoCSRFToken />
				<button type="submit" className="logout-btn" name="logout_btn">Log Out</button>
			</form>
		);
	}
}

MasterLogout.defaultProps = {
	logout_url: '/login/logoutaction/',
};

ReactDOM.render(     
  <MasterLogout />,
  document.getElementById('logout-option')        
);