import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Calendr from './calendr';
import CalendrWeek from './calendr-week';
import MasterLogin from './login';
import history from './history';
import MasterProfile from './profil';


const App = () => (
  <Router history={history}>
    <div>
      <Route exact path="/" component={Calendr}/>
      <Route path="/month" component={Calendr}/>
      <Route path="/week" component={CalendrWeek}/>
      <Route path="/login" component={MasterLogin}/>
      <Route path="/profil" component={MasterProfile}/>
    </div>
  </Router>
)
export default App
