import React from 'react';
import ReactDOM from 'react-dom';
import { getCookie } from './shared/getCookie';
import { isManager } from './shared/isManager';

class EmployeeRewardsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allRewards: [],
            isManager: false,
        };
    }

    componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
        if(!this.state.isManager) {
            this.updateRewards();
        }
    }

    updateRewards() {
        this.setState({postFinished: false});
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        var data = {
            points: this.props.total_points,
        };
        $.ajax({
            type: 'POST',
            url: this.props.rewardsUrl,
            datatype: 'json',
            data: data,
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
            <div className="employee-rewards-container">
                <h3>Earned Rewards</h3>
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

    render() {
        var rewards = this.props.rewards.slice(0);
        return(
            <ul className="employee-rewards list-unstyled">
                {rewards.map(reward =>
                    (<li id={reward.id} key={reward.id}>
                        <p>{reward.name} || {reward.required_points}</p>
                    </li>)
                )}
            </ul>
        );
    }
}

export default EmployeeRewardsContainer
