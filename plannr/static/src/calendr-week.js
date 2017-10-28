import React from 'react';
import ReactDOM from 'react-dom';
import calendrConst from './shared/calendr-const';
import AddEvent from './add-event'
import '../css/calendr-week.css';

class CalendrWeek extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            today: new Date(),
            selectedDt: new Date(),
            thisWeekMonday: this.getPreviousMonday(new Date()),
            weekEventsList: [],
        };
        this.getPreviousMonday = this.getPreviousMonday.bind(this);
        this.getDateFromMondayOffset = this.getDateFromMondayOffset.bind(this);
        this.nextWeek = this.nextWeek.bind(this);
        this.prevWeek = this.prevWeek.bind(this);
    }

    componentWillMount() {
        this.getWeekEvents();
    }

    getPreviousMonday(day) {
        var thisWeekMonday = new Date(day);
        thisWeekMonday.setDate(thisWeekMonday.getDate() - thisWeekMonday.getDay() + 1);
        return thisWeekMonday;
    }

    getDateFromMondayOffset(offset) {
        var currentDay = new Date(this.state.thisWeekMonday);
        currentDay.setDate(currentDay.getDate() + offset);
        return currentDay;
    }

    nextWeek() {
        var nextMonday = new Date()
        nextMonday.setDate(this.state.thisWeekMonday.getDate() + 7);
        this.setState({thisWeekMonday: nextMonday}, () => this.getWeekEvents());
    }

    prevWeek() {
        var prevMonday = new Date()
        prevMonday.setDate(this.state.thisWeekMonday.getDate() - 7);
        this.setState({thisWeekMonday: prevMonday}, () => this.getWeekEvents());
    }

    startTimeOnClick() {
        
    }

    getWeekEvents() {
        var thisWeekMonday = new Date(this.state.thisWeekMonday.getDate());
        console.log('monday get week events');
        console.log(this.state.thisWeekMonday);
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
                this.setState({weekEventsList: data});
            }.bind(this)
        })
    }

    render() {
        return (
            <div>
                <div className="calendr-week-wrapper">
                    <table className="calendr-week-table">
                        <tbody>
                            <WeekCalendrTitle thisWeekMonday={this.state.thisWeekMonday} nextWeek={this.nextWeek} prevWeek={this.prevWeek} />
                            <WeekHeader getDateFromMondayOffset={this.getDateFromMondayOffset} />
                            <WeekGrid />
                            <DayColumns weekEventsList={this.state.weekEventsList} />
                        </tbody>
                    </table>
                </div>
                <AddEvent selectedDate={this.state.selectedDt} startTimeSelected={'5:30'}/>
            </div>
        )
    }
}

CalendrWeek.defaultProps = {
    url: '/events/'
};

class WeekCalendrTitle extends React.Component {
    render() {
        var monday = this.props.thisWeekMonday.toLocaleDateString('en-GB');
        var sunday = new Date();
        sunday.setDate(this.props.thisWeekMonday.getDate() + 6);
        sunday = sunday.toLocaleDateString('en-GB');

        return (
            <tr className="title-row">
                <td className="time-buffer-col"></td>
                <td colSpan="7" className="calendr-week-header">
                    <div className="prev-arrow arrow-wrapper" onClick={this.props.prevWeek.bind(null, this)} >
                        <div className="r-prev" role="button" tabIndex="0"></div>
                    </div>
                    <div className="calendr-title">
                        {monday} - {sunday}
                    </div>   
                    <div className="next-arrow arrow-wrapper" onClick={this.props.nextWeek.bind(null, this)} >
                        <div className="r-next" role="button" tabIndex="0"></div>
                    </div>
                </td>
            </tr>
        )
    }
}

class WeekHeader extends React.Component {
    render() {
        return (
            <tr className="calendr-week-header">
                <td className="time-buffer-col"></td>
                {calendrConst.dayNames.map((item, index) => (
                    <td className="day-col day-title" key={item}>{item}
                    &nbsp;{this.props.getDateFromMondayOffset(index).getDate()}/{this.props.getDateFromMondayOffset(index).getMonth() + 1}
                    </td>
                ))}
            </tr>
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
            dayCols.push(<td key={i} className="day-col">
                <div className="day-col-events">
                    <EventsContainer events={this.props.weekEventsList[i]}/>
                </div></td>);
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

class EventsContainer extends React.Component {
    constructEventBlocks(events) {
        var eventBlocks = [];

        if(this.hasEvents(events)){ 
            for(var i = 0; i < events.length; i ++){
                var eventBlock = <EventBlock event={events[i]} key={events[i].id}/>
                eventBlocks.push(eventBlock)
            }
        }

        return eventBlocks;
    }

    hasEvents(events) {        
        return (events !== undefined && events.length > 0);
    }

    render() {
        var events = this.constructEventBlocks(this.props.events);

        return (
            <div>{events}</div>
        )
    }
}

class EventBlock extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

    getTimePosition(datetime) {
        var datetime = new Date(datetime);
        var hours = datetime.getHours();
        var minutes = datetime.getMinutes(); 

        var position = hours * calendrConst.hourWeekSize + minutes * calendrConst.minWeekSize;

        return position;
    }

    getEventSize(event) {
        var startPosition = this.getTimePosition(event.start_date);
        var endPosition = this.getTimePosition(event.end_date);

        var height = endPosition - startPosition;

        return height;
    }

    render() {
        var top = this.getTimePosition(this.props.event.start_date);
        var height = this.getEventSize(this.props.event);
        var eventStyle = {
            top: top,
            height: height
        }

        return (
            <div className='event-block' style={eventStyle} title={this.props.event.title}>
                <div className='event-name'>
                    {this.props.event.title}
                </div>
            </div>
        )
    }
}

export default CalendrWeek
