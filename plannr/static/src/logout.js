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

	attemptLogout(event) {
		var csrfToken = this.getCookie('csrftoken');
		$.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
		$.ajax({
			type: 'POST',
			url: this.props.logout_url,
			data: {},
			datatype: 'json',
			cache: false,
			success: function() {
				alert("Logout Success!");
				history.push('/login/');
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