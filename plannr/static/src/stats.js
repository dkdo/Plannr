import React from 'react';
import ReactDOM from 'react-dom';
import { getCookie } from './shared/getCookie';
import { isManager } from './shared/isManager';
import '../css/stats.css';

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
            statsContainer = <Stats hours={this.props.hours} taken={this.props.taken} given={this.props.given} total_points={this.props.total_points} shifts={this.props.all_shifts}/>
        }
        return(
            <div className="stats-content-container col-sm-2">
                <h1>Stats</h1>
                {statsContainer}
            </div>
        );
    }
}

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <table id="stats-table" className="table table-bordered stats-content">
                <tbody>
                    <tr>
                        <td>
                            Hours
                        </td>
                        <td>
                            {this.props.hours}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Taken Shifts
                        </td>
                        <td>
                            {this.props.taken}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Given Shifts
                        </td>
                        <td>
                            {this.props.given}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Total Shifts
                        </td>
                        <td>
                            {this.props.shifts}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            Total Points
                        </td>
                        <td>
                            {this.props.total_points}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }
}

export default StatsContainer
