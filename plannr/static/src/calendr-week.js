import React from 'react'
import ReactDOM from 'react-dom'
import calendrConst from './shared/calendr-const';
import '../css/calendr-week.css'

class CalendrWeek extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            today: new Date(),
            thisWeekMonday: this.getPreviousMonday(new Date()),
        };
        this.getPreviousMonday = this.getPreviousMonday.bind(this);
        this.getDateFromMondayOffset = this.getDateFromMondayOffset.bind(this);
    }

    componentWillMount(){
        this.getWeekEvents();
    }

    getPreviousMonday(day){
        var thisWeekMonday = new Date(day);
        thisWeekMonday.setDate(thisWeekMonday.getDate() - thisWeekMonday.getDay() + 1);
        return thisWeekMonday;
    }

    getDateFromMondayOffset(offset){
        var currentDay = new Date(this.state.thisWeekMonday);
        currentDay.setDate(currentDay.getDate() + offset);
        return currentDay;
    }

    getWeekEvents(){
        var thisWeekMonday = new Date(this.state.thisWeekMonday.getDate());
        // some API call to get events

        $.ajax({
            url: this.props.url + 'weekevents/',
            datatype: 'json',
            cache: false,
            data: {
                year: this.state.thisWeekMonday.getFullYear(),
                month: this.state.thisWeekMonday.getMonth(),
                day: this.state.thisWeekMonday.getDate()
            },
            success: function(data){
                console.log(data);
                this.setState({data: data});
            }.bind(this)
        })
    }

    render() {
        return (
            <table className="calendr-week">
                <tbody>
                    <WeekGrid />
                    <DayColumns />
                </tbody>
            </table>
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
                <div className="week-day-cell hour-col"></div>
                {calendrConst.dayNames.map((item, index) => (
                    <div className="week-day-cell day-title" key={item}>{item}
                    &nbsp;{this.props.getDateFromMondayOffset(index).getDate()}/{this.props.getDateFromMondayOffset(index).getMonth() + 1}
                    </div>
                ))}
            </div>
        )
    }
}

class WeekGrid extends React.Component {
    getHourSeparator() {
        var separators = [];
        for(var i = 0; i < 24; i++){
            separators.push(<div key={i} className="hour-cell"><div className="hour-cell-split"></div></div>);
        }
        return separators;
    }

    render() {
        let separators = null;
        separators = this.getHourSeparator();
        return (
            <tr>
                <td className="time-buffer-col"></td>
                <td colSpan="7">
                    <div className="hours-grid">
                        <div className="hour-separator">
                            {separators}
                        </div>
                    </div>
                </td>
            </tr>
        )
    }
}

class DayColumns extends React.Component {
    getDayCols() {
        var dayCols = [];
        for(var i = 0; i < 7; i++){
            dayCols.push(<td key={i} className="day-col"><div className="day-col-events"><div className="events"></div></div></td>);
        }
        return dayCols;
    }

    render(){
        let dayCols = null;
        dayCols = this.getDayCols();
        return(
            <tr>
                <TimeColumn />
                {dayCols}
            </tr>
        )
    }

}

class TimeColumn extends React.Component {
    getTime(rowIndex) {
        var timeString = rowIndex.toString() + ":00";
        return timeString;
    } 

    getTimeColumns(){
        var timeCols = [];
        for(var i = 0; i < 24; i++){
            timeCols.push(<div key={i} className="hour-cell">{this.getTime(i)}</div>);
        }
        return timeCols;
    }

    render() {
        var timeCols = this.getTimeColumns();
        return(
            <td className="hour-col">{timeCols}</td>
        )
    }
}

class EventBlock extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default CalendrWeek
