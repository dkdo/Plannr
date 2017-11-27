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
            this.getRewards();
        }
    }

    updateRewards() {
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        var data = {
            points: this.props.points,
        };
        $.ajax({
            type: 'POST',
            url: this.props.rewardsUrl,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                console.log('updated the rewards successfully');
            }.bind(this),
            error: function() {
                console.log("something went wrong with the rewards update");
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
                // this.setState({'allRewards': data.slice(0)});
            }.bind(this)
        })
    }

    render() {
        return(
            <div>
            </div>
        );
    }
}

EmployeeRewardsContainer.defaultProps = {
    rewardsUrl: '/rewards/assignRewards/',
    points: 45,
};

class EmployeeRewards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return(
            <div>
            </div>
        );
    }
}

export default EmployeeRewardsContainer
