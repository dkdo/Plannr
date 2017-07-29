import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
import Calendr from './calendr'
import CalendrWeek from './calendr-week'

const App = () => (
  <Router>
    <div>
      <Route exact path="/" component={Calendr}/>
      <Route path="/month" component={Calendr}/>
      <Route path="/week" component={CalendrWeek}/>
    </div>
  </Router>
)
export default App 
