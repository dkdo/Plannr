import React from 'react';
import ReactDOM from 'react-dom';
import { getCookie } from './shared/getCookie';
import { isManager } from './shared/isManager';
import '../css/employee-rewards.css';

class EmployeeRewardsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isManager: false,
            allRewards: [],
        };
    }


    componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
    }

    componentDidMount() {
        this.updateRewards();
    }

    updateRewards() {
        this.setState({postFinished: false});
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        $.ajax({
            type: 'PATCH',
            url: this.props.rewardsUrl,
            datatype: 'json',
            data: {},
            cache: false,
            success: function(data){
                console.log('updated the rewards successfully');
                this.getRewards();
            }.bind(this),
            error: function() {
                console.log("something went wrong with the rewards update");
                this.getRewards();
            }.bind(this)
        })
    }

    getRewards() {
        $.ajax({
            url: this.props.rewardsUrl,
            datatype: 'json',
            cache: false,
            success: function(data){
                console.log('rewards');
                console.log(data);
                if(data != '') {
                    this.setState({'allRewards': data.slice(0)});
                }
            }.bind(this)
        })
    }

    render() {
        return(
            <div className="employee-rewards-container col-sm-3">
                <h1>Earned Rewards</h1>
                <div className="employee-rewards-list">
                    <EmployeeRewards rewards={this.state.allRewards}/>
                </div>
            </div>
        );
    }
}

EmployeeRewardsContainer.defaultProps = {
    rewardsUrl: '/rewards/assignRewards/',
};

class EmployeeRewards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    getRenderRows() {
        var tableRows = [];
        var rewards = this.props.rewards.slice(0);
        for (var i = 0; i < rewards.length; i++) {
            tableRows.push(
                <EmployeeReward key={rewards[i].id} number={i+1} name={rewards[i].name} points={rewards[i].required_points} />
            )
        }
        return tableRows;
    }

    render() {
        var rows = this.getRenderRows();
        return(
            <table className="table table-striped employee-rewards-table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Reward</th>
                        <th scope="col">Needed Points</th>
                    </tr>
                </thead>
                <tbody className="employee-rewards-tbody">
                    {rows}
                </tbody>
            </table>
        );
    }
}

class EmployeeReward extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        return(
            <tr>
              <th scope="row">{this.props.number}</th>
              <td>{this.props.name}</td>
              <td>{this.props.points}</td>
            </tr>
        );
    }
}

export default EmployeeRewardsContainer
