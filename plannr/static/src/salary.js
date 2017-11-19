import React from 'react';
import ReactDOM from 'react-dom';
import '../css/salary.css';

class SalaryContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isManager: true,
        }
    }

    componentWillMount() {
        this.isManager();
    }

    isManager() {
        $.ajax({
            type: 'GET',
            url: this.props.isManagerUrl,
            datatype: 'json',
            cache: false,
            success: function(data){
                this.setState({'isManager': data});
            }.bind(this)
        })
    }

    render() {
        var salaryComponent = null;
        if (!this.state.isManager) {
            salaryComponent = <Salary />
        }
        return(
            <div>{salaryComponent}</div>
        )
    }
}

SalaryContainer.defaultProps = {
    isManagerUrl: '/profil/isManager/'
};

class Salary extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            salary: {today_hours: 0, today_salary: 0, week_hours: 0, week_salary: 0,
                     month_hours: 0, month_salary: 0, hourly_salary: 0}
        }
    }

    componentWillMount() {
        this.getWeekSalary();
    }

    getWeekSalary() {
        $.ajax({
            type: 'GET',
            url: '/salary/compute/',
            datatype: 'json',
            cache: false,
            success: function(data){
                console.log('salary');
                console.log(data);
                this.setState({'salary': data});
            }.bind(this)
        })
    }

    render() {
        return(
            <table className="salary-comp" id="salary-table">
                <caption>Expected Salary</caption>
                <tbody>
                <tr>
                    <td>
                        <div className="salary-title"><b>Month</b></div>
                        <div className="salary-amount"><b>{this.state.salary.month_salary}$</b></div>
                        <div><b><u><i>{this.state.salary.month_hours}</i> hours</u></b> x {this.state.salary.hourly_salary}$/h</div>
                    </td>
                    <td>
                        <div className="salary-title"><b>Week</b></div>
                        <div className="salary-amount"><b>{this.state.salary.week_salary}$</b></div>
                        <div><b><u><i>{this.state.salary.week_hours}</i> hours</u></b> x {this.state.salary.hourly_salary}$/h</div>
                    </td>
                </tr>
                </tbody>
            </table>
        )
    }
}

export default SalaryContainer
