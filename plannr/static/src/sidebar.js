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
              <div className="container">
              <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="#">Plannr</a>
                </div>
                <div id="navbar" className="collapse navbar-collapse">
                  <ul className="nav navbar-nav">
                    <li><a href="/">Month</a></li>
                    <li><a href="/week">Week</a></li>
                  </ul>
                </div>
              </div>
            </nav>
            <div id="sidebar-wrapper">
                <ul className="sidebar-nav">
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/shift-center">Shift Center</a>
                    </li>
                    <li>
                        <a href="/profil">Profile</a>
                    </li>
                    {this.state.isManager ?
                        <li>
                            <a href="/employees">Employees</a>
                        </li>
                        : null}
                    {this.state.isManager ?
                        <li>
                            <a href="/position">Position</a>
                        </li> : null}
                </ul>
                <div className="sidebar-logout">
                  <MasterLogout />
                </div>
            </div>
        </div>
        );
    }
}
export default Sidebar
