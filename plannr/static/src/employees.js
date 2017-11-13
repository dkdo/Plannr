import React from 'react';
import ReactDOM from 'react-dom';
import '../css/employees.css';

class EmployeesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
        };
    }

    componentDidMount() {
        this.getEmployees();
    }

    getEmployees() {
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            cache: false,
            success: function(data){
                console.log(data);
                this.setState({employees: data});
            }.bind(this)
        }) 
    }

    render() {
        return (
            <div className="employees-list">
                <Employees employees={this.state.employees}/>
            </div>
        )
    }
}

EmployeesList.defaultProps = {
    url: '/employees/'
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
            employeeCards.push(
                <Employee id={employees[i].user_id} key={employees[i].user_id} employee={employees[i]}/>
            )
        }
        return employeeCards;
    }

    render() {
        var employeeCards = this.getEmployeeCards();
        return(
            <div className="employee-cards list-group">
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
    }

    render() {
        return(
            <div className="employee-card list-group-item">
                <div className="first-name">
                    <div>First Name:</div>
                    <div>{this.props.employee.first_name}</div>
                </div>
                <div className="last-name">
                    <div>Last Name:</div>
                    <div>{this.props.employee.last_name}</div>
                </div>
                <div className="email">
                    <div>Email:</div>
                    <div>{this.props.employee.email}</div>
                </div>
                <div className="phone-num">
                    <div>Phone:</div>
                    <div>{this.props.employee.phone_num}</div>
                </div>
                <div className="birthdate">
                    <div>Birthdate:</div>
                    <div>{this.props.employee.birth_date}</div>
                </div>
                <div className="status">
                    <div>Status:</div>
                    <div>{this.props.employee.status}</div>
                </div>
            </div>
        )
    }
}

export default EmployeesList 
