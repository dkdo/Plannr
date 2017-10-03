import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import ReactDOM from 'react-dom';

export default class DjangoCSRFToken extends React.Component{
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
    console.log(csrfToken);
    return (
      <input type="hidden" name="csrfmiddlewaretoken" value={csrfToken || ''}></input>
      );
    }
}