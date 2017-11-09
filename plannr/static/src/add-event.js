import React from 'react';
import ReactDOM from 'react-dom';
import calendrConst from './shared/calendr-const';
import {getCookie} from './shared/getCookie';

class AddEvent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            endTimeOptions: []
        }
        this.startTimeChangeEvent = this.startTimeChangeEvent.bind(this);
        this.startTimeChange = this.startTimeChange.bind(this);
        this.endTimeChange = this.endTimeChange.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.addEvent = this.addEvent.bind(this);
    }

    componentDidMount() {
        this.setEndTimeOptions(this.props.eventStartTime);
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.eventStartTime !== nextProps.eventStartTime) {
            this.startTimeChange(nextProps.eventStartTime);
        }
    }


    addEvent(){
        if (this.props.eventTitle == ''){
            alert('Select a date and/or add a title!');
        }
        else{
            var start_date = this.parseEventStartDate().toISOString();
            var end_date = this.parseEventEndDate().toISOString();
            var data = {
                title: this.props.eventTitle,
                start_date: start_date,
                end_date: end_date
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
                    console.log(data);
                    this.props.addEventCallback(data);
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
            options.push(<option value={timeValue} key={timeValue}>{timeValue}</option>);
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
            endTimeOptions.push(<option value={endTimeValues[i]} key={endTimeValues[i]}>{endTimeValues[i]}</option>);
        }

        this.setState({endTimeOptions: endTimeOptions});

        return endTimeOptions;
    }

    startTimeChangeEvent(event){
        var newStartTime = event.target.value;
        this.startTimeChange(newStartTime);

        var startTimeChangeCallback = this.props.startTimeChangeCallback || null;
        if (startTimeChangeCallback) {
            startTimeChangeCallback(event.target.value);
        }
    }

    startTimeChange(newStartTime) {
        var newEndTimeValues = this.getEndTimeValues(newStartTime);
        this.setEndTimeOptions(newStartTime);
        
        // this.setState({endTimeOptions: newEndTimeOptions});
        this.props.startTimeChange(newStartTime);

        if(!newEndTimeValues.includes(this.props.eventEndTime)) {
            this.props.endTimeChange(newEndTimeValues[0]);
        }
    }

    endTimeChange(event) {
        this.props.endTimeChange(event.target.value);
    }


    titleChange(event) {
        this.props.titleChange(event.target.value);
    }

    render() {
        let options = this.getStartTimeOptions();
        return (
            <div className="eventAdder">
                <div>
                    <label>Title </label><input type="text" value={this.props.eventTitle} onChange={this.titleChange}/>
                </div>
                <div className="time-selectors">
                    <div>
                        <div>Start time: </div>
                        <select value={this.props.eventStartTime} onChange={this.startTimeChangeEvent}>
                            {options}
                        </select>
                    </div>
                    <div>
                        <div>End time:</div>
                        <select onChange={this.endTimeChange}>
                            {this.state.endTimeOptions}
                        </select>
                    </div>
                </div>
                <div className="btn btn-default btn-md" onClick={this.addEvent} role="button">Add Event</div>
            </div>
        );
    }
}

AddEvent.defaultProps = {
    url: '/events/',
    startTimeSelected: '0:00'
};

export default AddEvent
