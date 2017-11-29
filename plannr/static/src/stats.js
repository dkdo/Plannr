import React from 'react';
import ReactDOM from 'react-dom';
import { getCookie } from './shared/getCookie';
import { isManager } from './shared/isManager';

class StatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hours: 0,
            taken_shifts: 0,
            given_shifts: 0,
            isManager: false,
        };
    }

    componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
        if(!this.state.isManager) {
            this.getStats();
        }
    }

    getStats() {
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        var data = {};
        $.ajax({
            type: 'PATCH',
            url: this.props.getStats_url,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                if(data != '') {
                    console.log(data);
                    this.setState(data);
                }
            }.bind(this),
            error: function() {
                alert("something went wrong with the stats");
            }.bind(this)
        })
    }

    render() {
        var statsContainer = null;
        if(!this.state.isManager) {
            statsContainer = <Stats total_hours={this.state.hours} taken={this.state.taken_shifts} given={this.state.given_shifts}/>
        }
        return(
            <div className="stats-content-container">
                {statsContainer}
            </div>
        );
    }
}

StatsContainer.defaultProps = {
    getStats_url: '/stats/stat_list/',
}

class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    calculateTotal() {
        var hours_pts = this.props.total_hours * 10;
        var taken_pts = this.props.taken * 30;
        var given_pts = this.props.given * 30;
        var total_pts = hours_pts + taken_pts - given_pts;
        return total_pts;
    }

    render() {
        let total_pts = this.calculateTotal();
        return(
            <div className="stats-content">
                <div><b>Hours:</b></div>
                <div>{this.props.total_hours}</div>
                <div><b>Taken Shifts:</b></div>
                <div>{this.props.taken}</div>
                <div><b>Given Shifts:</b></div>
                <div>{this.props.given}</div>
                <div><b>Total Points:</b></div>
                <div>{total_pts}</div>
            </div>
        );
    }
}

export default StatsContainer
