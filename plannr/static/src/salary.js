import React from 'react';
import ReactDOM from 'react-dom';
import '../css/salary.css';
import salaryConst from './shared/salary-const';

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
            salaryComponent = <Salary selectedDate={this.props.selectedDate} type={this.props.type}/>
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
        this.getSalary();
    }

    componentWillReceiveProps(nextProps) {
        this.getSalary();
    }

    getSalary() {
        switch(this.props.type) {
            case salaryConst.weekSalary:
                this.getWeekSalary();
                break;
            case salaryConst.monthSalary:
                this.getMonthSalary();
                break;
            default:
                this.setState({salary: {today_hours: 0, today_salary: 0, week_hours: 0, week_salary: 0,
                                        month_hours: 0, month_salary: 0, hourly_salary: 0}});
        }
    }

    getWeekSalary() {
        let data = {selected_date: this.props.selectedDate}
        $.ajax({
            type: 'GET',
            url: '/salary/compute_week/',
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                console.log('salary');
                console.log(data);
                this.setState({'salary': data});
            }.bind(this)
        })
    }

    getMonthSalary() {
        let data = {selected_date: this.props.selectedDate}
        $.ajax({
            type: 'GET',
            url: '/salary/compute_month/',
            datatype: 'json',
            data: data,
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
                <caption><b>Expected Salary</b></caption>
                <tbody>
                <tr>
                    <td>
                        <div className="salary-group">
                            <b>Month<br /></b>
                            <div className="salary-amount">
                                <b>{this.state.salary.month_salary}$</b>
                            </div>
                            <div><b><u><i>{this.state.salary.month_hours}</i> hours</u></b> x {this.state.salary.hourly_salary}$/h</div>
                        </div>
                    </td>
                    <td>
                        <div className="salary-group">
                            <b>Week<br /></b>
                            <div className="salary-amount">
                                <b>{this.state.salary.week_salary}$</b>
                            </div>
                            <div><b><u><i>{this.state.salary.week_hours}</i> hours</u></b> x {this.state.salary.hourly_salary}$/h</div>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        )
    }
}

export default SalaryContainer
