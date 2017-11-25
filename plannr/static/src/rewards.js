import React from 'react';
import ReactDOM from 'react-dom';
import DjangoCSRFToken from './shared/csrf';
import { isManager } from './shared/isManager.js';
import { getCookie } from './shared/getCookie';

class MasterReward extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
}

export default MasterReward
