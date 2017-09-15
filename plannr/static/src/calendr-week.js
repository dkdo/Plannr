import React from 'react'
import ReactDOM from 'react-dom'
import calendrConst from './shared/calendr-const';
import '../css/calendr-week.css'

class CalendrWeek extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numOfHalfHours: 48,
            today: new Date(),
            prevSunday: this.getPreviousSunday(new Date()),
        };
        this.getPreviousSunday = this.getPreviousSunday.bind(this);
        this.getDateFromSundayOffset = this.getDateFromSundayOffset.bind(this);
    }

    componentWillMount(){
        this.getWeekEvents();
    }

    getPreviousSunday(day){
        var prevSunday = new Date(day);
        prevSunday.setDate(prevSunday.getDate() - prevSunday.getDay());
        return prevSunday;
    }

    getDateFromSundayOffset(offset){
        var currentDay = new Date(this.state.prevSunday);
        currentDay.setDate(currentDay.getDate() + offset);
        return currentDay;
    }

    getWeekEvents(){
        var prevSunday = new Date(this.state.prevSunday.getDate());
        
        // some API call to get events

        $.ajax({
            url: this.props.url + 'weekevents/',
            datatype: 'json',
            cache: false,
            data: {
                year: this.state.prevSunday.getFullYear(),
                month: this.state.prevSunday.getMonth(),
                day: this.state.prevSunday.getDate()
            },
            success: function(data){
                this.setState({data: data});
            }.bind(this)
        })
    }

    render() {
        return (
            <div className="calendr-week">
                <WeekHeader dayNames={calendrConst.dayNames} getDateFromSundayOffset={this.getDateFromSundayOffset}/>
                <WeekGrid dayNames={calendrConst.dayNames}/>
            </div>
        )
    }
}

CalendrWeek.defaultProps = {
    url: '/events/'
};

class WeekHeader extends React.Component {
    render() {
        return(
            <div className="week-days">
                <div className="week-day hour-col"></div>
                {calendrConst.dayNames.map((item, index) => (
                    <div className="week-day" key={item}>{item}
                    &nbsp;{this.props.getDateFromSundayOffset(index).getDate()}/{this.props.getDateFromSundayOffset(index).getMonth() + 1}
                    </div>
                ))}
            </div>
        )
    }
}

class WeekGrid extends React.Component {
    getWeekContainers(){
        var weeks = [];
        for(var i = 0; i < 48; i++){
            weeks.push(<WeekContainer key={i} rowIndex={i}/>);
        }
        return weeks;
    }
    render() {
        let weeks = null;
        weeks = this.getWeekContainers();
        return(
            <div className="week-grid">{weeks}</div>
        )
    }
}

class WeekContainer extends React.Component {
    getWeekDays() {
        var weekDays = [];
        for(var i = 0; i < 7; i++){
            weekDays.push(<WeekDay key={i}/>);
        }
        return weekDays;
    }
    render(){
        let weekDays = null;
        weekDays = this.getWeekDays();
        return(
            <div className="week-days">
                <WeekTime rowIndex={this.props.rowIndex}/>
                {weekDays}
            </div>
        )
    }
}

class WeekDay extends React.Component {
    render(){
        return(
            <div className="week-day"></div>
        )
    }

}

class WeekTime extends React.Component {
    getTime(rowIndex) {
        var hour = Math.floor(rowIndex / 2);
        var minute = rowIndex % 2;
        var minuteString = minute === 0 ? "00" : "30";

        var timeString = hour.toString() + ":" + minuteString;

        return timeString;
    } 
    render() {
        var rowTime = this.getTime(this.props.rowIndex);
        return(
            <div className="week-day hour-col">{rowTime}</div>
        )
    }
}

export default CalendrWeek
