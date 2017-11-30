import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import Calendr from './calendr';
import CalendrWeek from './calendr-week';
import MasterLogin from './login';
import history from './history';
import MasterProfile from './profil';
import MasterPosition from './position';
import Employees from './employees';
import ShiftCenter from './shift-center';
import MasterLogout from './logout';
import { isManager } from './shared/isManager';


class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isManager: false,
        };
    }

    componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
    }

    render() {
        return(
        <div>
            <nav className="navbar navbar-inverse navbar-fixed-top">
              <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a href="/"><img src="/static/plannr_logo_small.png" className="navbar-icon"></img></a>
                </div>
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  <ul className="nav navbar-nav">
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">Calendar<b className="caret"></b></a>
                        <ul className="dropdown-menu">
                          <li><a href="/">Month</a></li>
                          <li className="divider"></li>
                          <li><a href="/week">Week</a></li>
                        </ul>
                    </li>
                    <li><a href="/shift-center">Shift Center</a></li>
                    <li className="dropdown">
                        <a href="#" className="dropdown-toggle" data-toggle="dropdown">Manage <b className="caret"></b></a>
                        <ul className="dropdown-menu">
                          <li><a href="/employees">Employees</a></li>
                          <li className="divider"></li>
                          <li><a href="/position">Position</a></li>
                          <li className="divider"></li>
                          <li><a href="/rewards">Rewards</a></li>
                        </ul>
                    </li>
                  </ul>
                  <ul className="nav navbar-nav navbar-right">
                      <li><a href="/profil">Profile</a></li>
                      <li><a><MasterLogout /></a></li>
                  </ul>
                </div>
            </nav>
        </div>
        );
    }
}
export default Sidebar
