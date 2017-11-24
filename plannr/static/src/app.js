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
import Sidebar from './sidebar'


class App extends React.Component {
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
        var currentPath = window.location.pathname;
        var showBar = !currentPath.includes('/login/');
        return(
            <Router history={history}>
                <div>
                    {showBar ? <Sidebar /> : null}
                      <div className="main-content-wrapper" id="content-wrapper">
                        <Route exact path="/" component={Calendr}/>
                        <Route path="/month" component={Calendr}/>
                        <Route path="/week" component={CalendrWeek}/>
                        <Route path="/login" component={MasterLogin}/>
                        <Route path="/profil" component={MasterProfile}/>
                        <Route path="/position" component={MasterPosition}/>
                        <Route path="/employees" component={Employees}/>
                        <Route path="/shift-center" component={ShiftCenter}/>
                       </div>
                  </div>
            </Router>
        );
    }
}
export default App
