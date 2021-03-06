import React from 'react';
import ReactDOM from 'react-dom';
import calendrConst from './shared/calendr-const';
import Select from 'react-select';
import {getCookie} from './shared/getCookie';
import {isManager} from './shared/isManager';
import AlertDismissable from './alert-dismissable.js';

class AddEventContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isManager: false,
        }
    }

    componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
    }

    render() {
        var addEventComponent = null;
        if (this.state.isManager) {
            addEventComponent = <AddEvent selectedDate={this.props.selectedDate} addEventCallback={this.props.addEventCallback}
                                          eventStartTime={this.props.eventStartTime} eventEndTime={this.props.eventEndTime} eventTitle={this.props.eventTitle}
                                          startTimeChange={this.props.startTimeChange} endTimeChange={this.props.endTimeChange} titleChange={this.props.titleChange}
                                          events={this.props.events}/>
        }
        return(
            <div>{addEventComponent}</div>
        )
    }
}

class AddEvent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            endTimeOptions: [],
            employeeId: null,
            showAlert: false,
            headline: '',
            alertText: '',
            bsStyle: '',
        }
        this.startTimeChangeEvent = this.startTimeChangeEvent.bind(this);
        this.startTimeChange = this.startTimeChange.bind(this);
        this.endTimeChange = this.endTimeChange.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.handleEmployeeChange = this.handleEmployeeChange.bind(this);
        this.addEvent = this.addEvent.bind(this);
        this.checkShiftFit = this.checkShiftFit.bind(this);
        this.doesShiftOverlap = this.doesShiftOverlap.bind(this);
        this.alertDismiss = this.alertDismiss.bind(this);
    }

    componentDidMount() {
        this.setEndTimeOptions(this.props.eventStartTime);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.eventStartTime !== nextProps.eventStartTime) {
            this.startTimeChange(nextProps.eventStartTime);
        }
    }

    checkShiftFit() {
        for(let i = 0; i < this.props.events.length; i++){
            if(this.props.events[i].employee_profile.user_id == this.state.employeeId){
                if(this.doesShiftOverlap(new Date(this.parseEventStartDate()), new Date(this.parseEventEndDate()),
                                    new Date(this.props.events[i].start_date), new Date(this.props.events[i].end_date))) {
                    return false;
                }
            }
        }
        return true;
    }

    alertDismiss() {
        this.setState({showAlert: false});
    }

    doesShiftOverlap(newStart, newEnd, oldStart, oldEnd) {
        var startsAfter = newStart >= oldStart && newStart < oldEnd;
        var startsBefore = newStart <= oldStart && newEnd > oldStart;
        var isIn = newStart >= oldStart && newEnd <= oldEnd;
        return startsAfter || startsBefore || isIn;
    }

    addEvent(){
        if (this.props.eventTitle == ''){
            let alertState = {headline: 'Uh oh!', alertText: 'Select a date and/or add a title!', showAlert: true, bsStyle: 'danger'};
            this.setState(alertState);
        }
        else if (!this.checkShiftFit()) {
            let alertState = {headline: 'Uh oh!', alertText: 'Employee already has an overlapping shift at that time period!', showAlert: true, bsStyle: 'danger'};
            this.setState(alertState);
        }
        else if (!this.state.employeeId || this.state.employeeId === null){
            let alertState = {headline: 'Uh oh!', alertText: 'Select an employee!', showAlert: true, bsStyle: 'danger'};
            this.setState(alertState);
        }
        else{
            var start_date = this.parseEventStartDate().toISOString();
            var end_date = this.parseEventEndDate().toISOString();
            var data = {
                title: this.props.eventTitle,
                start_date: start_date,
                end_date: end_date,
                employee_id: this.state.employeeId
            }
            var csrfToken = getCookie('csrftoken');
            $.ajaxSetup({
                beforeSend: function(xhr, settings) {
                    xhr.setRequestHeader("X-CSRFToken", csrfToken);
                }
            });
            $.ajax({
                type: 'POST',
                url: this.props.url,
                data: data,
                datatype: 'json',
                cache: false,
                success: function(data) {
                    this.props.addEventCallback(data);
                    let alertState = {headline: 'Success!', alertText: 'Added new shift!', showAlert: true, bsStyle: 'success'};
                    this.setState(alertState);
                }.bind(this)
            })
            this.props.titleChange('');
        }
    }

    parseEventStartDate(){
        // var date = this.getSelectedDate();
        var date = this.props.selectedDate
        var hourMin = this.props.eventStartTime.split(':');
        date.setHours(hourMin[0]);
        date.setMinutes(hourMin[1]);
        return date;
    }

    parseEventEndDate(){
        // var date = this.getSelectedDate();
        var date= this.props.selectedDate
        var hourMin = this.props.eventEndTime.split(':');
        date.setHours(hourMin[0]);
        date.setMinutes(hourMin[1]);
        return date;
    }

    getStartTimeOptions() {
        var options = [];
        var timeValue, minutes, hours;
        for (let i = 0; i < 48; i++){
            minutes = i % 2 === 0 ? '00' : '30';
            hours = parseInt(i/2);
            timeValue = hours + ':' + minutes;
            //options.push(<option value={timeValue} key={timeValue}>{timeValue}</option>);
            options.push({value: timeValue, label: timeValue});
        }
        return options;
    }

    getEndTimeValues(startTime) {
        var endTimeValues = [];
        var timeValue, minutes, hours;
        var timeSelectedHourMinute = startTime.split(':');
        var optionStart = parseInt(timeSelectedHourMinute[0]) * 2;
        optionStart = timeSelectedHourMinute[1] === '00' ? optionStart : optionStart + 1;
        optionStart += 1;

        for (let i = optionStart; i < 48; i++){
            minutes = i % 2 === 0 ? '00' : '30';
            hours = parseInt(i/2);
            timeValue = hours + ":" + minutes;
            endTimeValues.push(timeValue);
        }

        return endTimeValues;
    }

    setEndTimeOptions(startTime) {
        var endTimeOptions = [];
        var endTimeValues = this.getEndTimeValues(startTime);

        for(let i = 0; i < endTimeValues.length; i++){
            //endTimeOptions.push(<option value={endTimeValues[i]} key={endTimeValues[i]}>{endTimeValues[i]}</option>);
            endTimeOptions.push({value: endTimeValues[i], label: endTimeValues[i]});
        }

        this.setState({endTimeOptions: endTimeOptions});
        console.log('settting options');
        console.log(endTimeOptions)
        return endTimeOptions;
    }

    startTimeChangeEvent(newStartTime){
        var newStartTimeValue = newStartTime.value;
        this.startTimeChange(newStartTimeValue);

        var startTimeChangeCallback = this.props.startTimeChangeCallback || null;
        if (startTimeChangeCallback) {
            startTimeChangeCallback(newStartTimeValue);
        }
    }

    startTimeChange(newStartTime) {
        var newEndTimeValues = this.getEndTimeValues(newStartTime);
        this.setEndTimeOptions(newStartTime);

        this.props.startTimeChange(newStartTime);

        if(!newEndTimeValues.includes(this.props.eventEndTime)) {
            this.props.endTimeChange(newEndTimeValues[0]);
        }
    }

    handleEmployeeChange(selectedEmployee) {
        this.setState({'employeeId': selectedEmployee});
    }

    endTimeChange(newEndTime) {
        this.props.endTimeChange(newEndTime.value);
    }


    titleChange(event) {
        this.props.titleChange(event.target.value);
    }

    render() {
        let startOptions = this.getStartTimeOptions();
        return (
            <div className="eventAdder">
                <AlertDismissable alertVisible={this.state.showAlert} bsStyle={this.state.bsStyle} headline={this.state.headline} alertText={this.state.alertText}
                                  alertDismiss={this.alertDismiss}/>
                <p className="calendar-subtitle"><b>New Event</b></p>
                <div className="eventAdder-info">
                    <div><b>Title: </b></div>
                    <input className="form-control" type="text" value={this.props.eventTitle} onChange={this.titleChange}/>
                </div>
                <div className="event-selectors">
                    <div className="eventAdder-info">
                        <div><b>Start time:</b></div>
                        <Select
                            value={this.props.eventStartTime}
                            onChange={this.startTimeChangeEvent}
                            options={startOptions}
                            autosize={false}
                            clearable={false} />
                    </div>
                    <div className="eventAdder-info">
                        <div><b>End time:</b></div>
                        <Select
                            value={this.props.eventEndTime}
                            onChange={this.endTimeChange}
                            autosize={false}
                            clearable={false}
                            options={this.state.endTimeOptions}
                        />
                    </div>
                    <div className="eventAdder-info">
                        <div><b>Employee: </b></div>
                        <EmployeeSelect
                            handleEmployeeChange={this.handleEmployeeChange}
                            employeeId={this.state.employeeId}
                        />
                    </div>
                </div>
                <div className="eventAdder-btn btn plannr-btn" onClick={this.addEvent} role="button">Add Event</div>
            </div>
        );
    }
}

AddEvent.defaultProps = {
    url: '/events/',
    startTimeSelected: '0:00'
};

class EmployeeSelect extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            employeeOptions: []
        }

        this.onEmployeeChange = this.onEmployeeChange.bind(this);
    }

    componentWillMount() {
        this.loadEmployees();
    }

    loadEmployees() {
        $.ajax({
            type: 'GET',
            url: this.props.employeesUrl,
            datatype: 'json',
            cache: false,
            success: function(data){
                this.getEmployeeOptions(data);
            }.bind(this)
        })
    }

    getEmployeeOptions(employees) {
        var employeeOptions = [];

        for(var i = 0; i < employees.length; i++) {
            employeeOptions.push({value: employees[i].user_id, label: employees[i].first_name + ', ' + employees[i].last_name});
        }

        this.setState({employeeOptions: employeeOptions})
        return employeeOptions;
    }

    onEmployeeChange(newEmployee) {
        this.props.handleEmployeeChange(newEmployee.value);
    }

    render() {
        return (
            <div>
                <Select value={this.props.employeeId} options={this.state.employeeOptions}
                        autosize={false} onChange={this.onEmployeeChange}
                        clearable={false} />
            </div>
        )
    }

}

EmployeeSelect.defaultProps = {
    employeesUrl: '/employees/'
}

export default AddEventContainer
