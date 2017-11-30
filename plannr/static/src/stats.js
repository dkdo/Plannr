import React from 'react';
import ReactDOM from 'react-dom';
import { getCookie } from './shared/getCookie';
import { isManager } from './shared/isManager';

class StatsContainer extends React.Component {
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
        var statsContainer = null;
        if(!this.state.isManager) {
            statsContainer = <Stats hours={this.props.hours} taken={this.props.taken} given={this.props.given} points={this.props.total_points}/>
        }
        return(
            <div className="stats-content-container">
                {statsContainer}
            </div>
        );
    }
}

// StatsContainer.defaultProps = {
//     getStats_url: '/stats/stat_list/',
// }

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <div className="stats-content">
                <div><b>Hours:</b></div>
                <div>{this.props.hours}</div>
                <div><b>Taken Shifts:</b></div>
                <div>{this.props.taken}</div>
                <div><b>Given Shifts:</b></div>
                <div>{this.props.given}</div>
                <div><b>Total Points:</b></div>
                <div>{this.props.total_points}</div>
            </div>
        );
    }
}

export default StatsContainer
