import React from 'react'
import ReactDOM from 'react-dom'
import '../css/calendr-week.css'

class CalendrWeek extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthNamesFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            numOfHours: 24,
            numOfHalfHours: 48,
            today: new Date(),
            prevSunday: this.getPreviousSunday(new Date()),
            gridArray: this.setGridArray()
        };
        this.getPreviousSunday = this.getPreviousSunday.bind(this);
        this.getDateFromSundayOffset = this.getDateFromSundayOffset.bind(this);
    }

    componentWillMount(){
        this.getWeekEvents();
    }

    setGridArray(){
        var weekArray = new Array(48);
        weekArray.fill(Array(7));
        for (var i = 0; i < weekArray.length; i ++){
            weekArray[i].fill({event: null});
        }
        return weekArray;
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
                <WeekHeader dayNames={this.state.dayNames} getDateFromSundayOffset={this.getDateFromSundayOffset}/>
                <WeekGrid dayNames={this.state.dayNames} gridArray={this.state.gridArray}/>
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
                {this.props.dayNames.map((item, index) => (
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
        for(var i = 0; i < this.props.gridArray.length; i++){
            weeks.push(<WeekContainer key={i} weekDays={this.props.gridArray[i]} rowIndex={i}/>);
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
        for(var i = 0; i < this.props.weekDays.length; i++){
            weekDays.push(<WeekDay key={i} dayDetail={this.props.weekDays[i]}/>);
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
            <div className="week-day">{this.props.dayDetail.event}</div>
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
