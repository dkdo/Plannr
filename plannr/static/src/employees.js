import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import {getCookie} from './shared/getCookie';
import AlertDismissable from './alert-dismissable.js';
import '../css/employees.css';

class EmployeesList extends React.Component {
    constructor(props) {
        super(props);

        this.oldEmployees = [];

        this.state = {
            newEmployees: [],
            positionOptions: [],
            positionChanges: [],
            newStats: {},
            showAlert: false,
        };
        this.handlePositionChange = this.handlePositionChange.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.resetChanges = this.resetChanges.bind(this);
        this.alertDismiss = this.alertDismiss.bind(this);
        this.saveSuccess = this.saveSuccess.bind(this);
    }

    componentWillMount() {
        this.loadEmployees();
        this.loadPositions();
        this.loadStats();
    }

    saveSuccess() {
        this.setState({showAlert: true});
    }

    alertDismiss() {
        this.setState({showAlert: false});
    }

    loadStats() {
        $.ajax({
            url: this.props.statsUrl,
            datatype: 'json',
            cache: false,
            success: function(data){
                console.log('stats');
                console.log(data);
                this.getEmployeeStats(data);
            }.bind(this)
        })
    }

    loadEmployees() {
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            cache: false,
            success: function(data){
                console.log('employees');
                console.log(data);
                this.oldEmployees = JSON.parse(JSON.stringify(data));
                this.setState({'newEmployees': data.slice(0)});
            }.bind(this)
        })
    }

    loadPositions() {
        $.ajax({
            type: 'GET',
            url: this.props.positionsUrl,
            datatype: 'json',
            cache: false,
            success: function(data){
                console.log('positions');
                console.log(data);
                this.getPositionOptions(data);
            }.bind(this),
        })
    }

    getEmployeeStats(stats) {
        var employeeStats = {};
        for(var i = 0; i < stats.length; i++) {
            var hours = stats[i].hours * 10;
            var taken = stats[i].taken_shifts * 30;
            var given = stats[i].given_shifts * 30;
            var total_pts = hours + taken - given;
            employeeStats[stats[i].user_id] = total_pts;
        }
        console.log('changed stats');
        console.log(JSON.stringify(employeeStats));
        this.setState({newStats: employeeStats});
    }

    getPositionOptions(positions) {
        var positionOptions = [];
        for(var i = 0; i < positions.length; i++) {
            positionOptions.push({value: positions[i].id, label: positions[i].title});
        }
        this.setState({positionOptions: positionOptions})
        return positionOptions;
    }

    handlePositionChange(employee, newPosition) {
        this.addNewChange(employee, newPosition);

        var newEmployees = this.state.newEmployees.slice(0);
        var employeeIndex = newEmployees.indexOf(employee);
        newEmployees[employeeIndex].position_id = newPosition.value;
        this.setState({'employees': newEmployees}, () => console.log(this.oldEmployees));
    }

    addNewChange(employee, newPosition) {
        var positionChanges = this.state.positionChanges.slice(0);
        var oldChange = positionChanges.find(p => p.employee_id === employee.user_id);

        if (oldChange) {
            var oldIndex = positionChanges.indexOf(oldChange);
            positionChanges.splice(oldIndex, 1);
            this.setState({'positionChanges': positionChanges});
        }

        if (this.isPositionOld(employee, newPosition))
            return;

        positionChanges.push({employee_id: employee.user_id, position_id: newPosition.value});
        this.setState({positionChanges: positionChanges});
    }

    isPositionOld(employee, newPosition) {
        var oldEmployees = this.oldEmployees.slice(0);
        var oldEmployee = oldEmployees.find(e => e.user_id === employee.user_id);
        return oldEmployee.position_id === newPosition.value;
    }

    saveChanges() {
        var positionChanges = this.state.positionChanges.slice(0);

        for (var i = 0; i < positionChanges.length; i++) {
            var csrfToken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", csrfToken);
                }
            });
            $.ajax({
                type: 'PATCH',
                url: this.props.positionUpdateUrl,
                datatype: 'json',
                cache: false,
                data: {
                    employee_id: positionChanges[i].employee_id,
                    position_id: positionChanges[i].position_id
                },
                success: function(data){
                    this.saveSuccess();
                }.bind(this),
            })
        }

        this.setState({'positionChanges': []});
    }

    resetChanges() {
        this.loadPositions();
        this.loadEmployees();
        this.setState({'positionChanges': []});
    }

    render() {
        return (
            <div>
                <AlertDismissable alertVisible={this.state.showAlert} bsStyle="success" headline="Success!" alertText="Saved employee positions!"
                                  alertDismiss={this.alertDismiss}/>
                <h1 className="page-title">Employees</h1>
                <div className="empl-btns text-center">
                    <button className="plannr-btn btn" onClick={this.saveChanges}>SAVE</button>
                    <button className="plannr-btn btn" onClick={this.resetChanges}>RESET</button>
                </div>
                <div className="employees-list">
                    <Employees employees={this.state.newEmployees} positionOptions={this.state.positionOptions}
                               handlePositionChange={this.handlePositionChange} stats={this.state.newStats}/>
                </div>
            </div>
        )
    }
}

EmployeesList.defaultProps = {
    url: '/employees/',
    positionsUrl: '/position/positionList/',
    positionUpdateUrl: '/profil/changePosition/',
    statsUrl: '/stats/updateStatsList/',
};

class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.getEmployeeCards = this.getEmployeeCards.bind(this);
    }

    getEmployeeCards() {
        var employeeCards = [];
        var employees = this.props.employees.slice(0);
        for(var i = 0; i < employees.length; i++){
            var user_id = employees[i].user_id;
            var hasStats = this.props.stats.hasOwnProperty(user_id);
            employeeCards.push(
                <Employee id={user_id} key={employees[i].user_id}
                          employee={employees[i]} positionOptions={this.props.positionOptions}
                          handlePositionChange={this.props.handlePositionChange}
                          totals={hasStats ? this.props.stats[user_id]: 0}/>
            )
        }
        return employeeCards;
    }
    render() {
        var employeeCards = this.getEmployeeCards();
        return(
            <div className="empl-grid">
                {employeeCards}
            </div>
        )
    }
}

class Employee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.onPositionChange = this.onPositionChange.bind(this);
    }

    onPositionChange(newPosition) {
        this.props.handlePositionChange(this.props.employee, newPosition);
    }

    render() {
        return(
            <div className="empl-card">
                <h3 className="text-center">{this.props.employee.first_name} {this.props.employee.last_name}</h3>
                {this.props.employee.status ? <h5>*{this.props.employee.status}*</h5> : null}
                <ul className="empl-info-list list-unstyled">
                    <li>
                        <h5>Birthdate:</h5>
                        <p>{this.props.employee.birth_date}</p>
                    </li>
                    <li>
                        <h5>Position:</h5>
                        <Select value={this.props.employee.position_id} options={this.props.positionOptions}
                                autosize={false} onChange={this.onPositionChange}
                                clearable={false} />
                    </li>
                    <li>
                        <h5>Phone#:</h5>
                        <p>{this.props.employee.phone_num}</p>
                    </li>
                    <li>
                        <h5>Email:</h5>
                        <p>{this.props.employee.email}</p>
                    </li>
                    <li>
                        <h5>Total Points:</h5>
                        <p>{this.props.totals}</p>
                    </li>
                </ul>
            </div>
        )
    }
}

export default EmployeesList
