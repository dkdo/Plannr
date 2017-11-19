import React from 'react';
import ReactDOM from 'react-dom';
import calendrConst from './shared/calendr-const';
import AddEventContainer from './add-event'
import SalaryContainer from './salary';
import EventList from './event-list';
import '../css/calendr-week.css';

class CalendrWeek extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            today: new Date(),
            selectedDate: new Date(),
            eventStartTime: '0:00',
            eventEndTime: '0:30',
            eventTitle: '',
            thisWeekMonday: new Date(),
            weekEventsList: [],
            timeHighlight: false
        };
        this.getPreviousMonday = this.getPreviousMonday.bind(this);
        this.nextWeek = this.nextWeek.bind(this);
        this.prevWeek = this.prevWeek.bind(this);
        this.startTimeOnClick = this.startTimeOnClick.bind(this);
        this.dayOnClick = this.dayOnClick.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.startTimeChange = this.startTimeChange.bind(this);
        this.endTimeChange = this.endTimeChange.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.addEventCallback = this.addEventCallback.bind(this);
    }


    componentWillMount() {
        this.setState({thisWeekMonday: this.getPreviousMonday(this.state.today)})
    }

    componentDidMount() {
        this.getWeekEvents();
    }

    getPreviousMonday(day) {
        var thisWeekMonday = new Date(day);
        thisWeekMonday.setDate(thisWeekMonday.getDate() - thisWeekMonday.getDay() + 1);
        return thisWeekMonday;
    }

    nextWeek() {
        var nextMonday = new Date(this.state.thisWeekMonday)
        nextMonday.setDate(nextMonday.getDate() + 7);
        this.setState({thisWeekMonday: nextMonday}, () => this.getWeekEvents());
    }

    prevWeek() {
        var prevMonday = new Date(this.state.thisWeekMonday)
        prevMonday.setDate(prevMonday.getDate() - 7);
        this.setState({thisWeekMonday: prevMonday}, () => this.getWeekEvents());
    }

    startTimeOnClick(newStartTime) {
        this.setState({eventStartTime: newStartTime});
    }

    dayOnClick(weekdayId) {
        // Monday is 1 in JS, but 0 in python
        var selectedDate = new Date(weekdayId);

        if (!this.state.timeHighlight) {
              document.addEventListener('click', this.handleOutsideClick, false);
        }
        this.setState({
            selectedDate: selectedDate,
            timeHighlight: true
        });
    }

    getWeekEvents() {
        var thisWeekMonday = new Date(this.state.thisWeekMonday.getDate());
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

    titleChange(newTitle) {
        this.setState({eventTitle: newTitle});
    }

    startTimeChange(newStartTime) {
        this.setState({eventStartTime: newStartTime});
    }

    endTimeChange(newEndTime) {
        this.setState({eventEndTime: newEndTime});
    }

    addEventCallback(event) {
        this.getWeekEvents();
    }

    handleOutsideClick(e) {
        if (this.dayColumns.contains(e.target) || this.addEventComp.contains(e.target)) {
            return;
        }

        document.removeEventListener('click', this.handleOutsideClick, false);
        this.setState({timeHighlight: false});
    }
    render() {
        let weekEvents = [].concat.apply([], this.state.weekEventsList);
        return (
            <div className="calendr-week-main-wrapper">
                <div className="calendr-week-wrapper">
                    <table className="calendr-week-table">
                        <tbody ref={(dayColumns) => (this.dayColumns = dayColumns)}>
                            <WeekCalendrTitle thisWeekMonday={this.state.thisWeekMonday} nextWeek={this.nextWeek} prevWeek={this.prevWeek} />
                            <WeekHeader thisWeekMonday={this.state.thisWeekMonday} />
                            <DayColumns weekEventsList={this.state.weekEventsList}
                                        dayOnClick={this.dayOnClick} startTimeOnClick={this.startTimeOnClick}
                                        thisWeekMonday={this.state.thisWeekMonday}
                                        timeHighlight={this.state.timeHighlight} selectedDate={this.state.selectedDate}
                                        eventStartTime={this.state.eventStartTime} eventEndTime={this.state.eventEndTime}/>
                        </tbody>
                    </table>
                </div>
                <table className="calendr-week-modules" ref={(addEventComp) => {this.addEventComp = addEventComp}} >
                    <tbody>
                        <tr>
                            <td>
                                <SalaryContainer />
                                <AddEventContainer selectedDate={this.state.selectedDate} addEventCallback={this.addEventCallback}
                                                   eventStartTime={this.state.eventStartTime} eventEndTime={this.state.eventEndTime} eventTitle={this.state.eventTitle}
                                                   startTimeChange={this.startTimeChange} endTimeChange={this.endTimeChange} titleChange={this.titleChange}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className="event-list-title"><b>Shifts</b></div>
                                <EventList dayEventList={weekEvents}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
    constructor(props) {
        super(props);
        this.getDayTitle = this.getDayTitle.bind(this);
        this.getDateFromMondayOffset = this.getDateFromMondayOffset.bind(this);
    }

    getDateFromMondayOffset(offset) {
        var currentDay = new Date(this.props.thisWeekMonday);
        currentDay.setDate(currentDay.getDate() + offset);
        return currentDay;
    }

    getDayTitle(index) {
        var title = ' ' + this.getDateFromMondayOffset(index).getDate() + '/' + (this.getDateFromMondayOffset(index).getMonth() + 1);
        return title
    }

    render() {
        return (
            <tr className="calendr-week-header">
                <td className="time-buffer-col"></td>
                {calendrConst.dayNames.map((item, index) => (
                    <td className="day-col day-title" key={item}>{item}
                        {this.getDayTitle(index)}
                    </td>
                ))}
            </tr>
        )
    }
}

class DayColumns extends React.Component {
    constructor(props) {
        super(props);
    }

    getDayCols() {
        var dayCols = [];
        // Monday is 1 in JS, but 0 in python
        for(var i = 0; i < 7; i++){
            var dayDate = new Date(this.props.thisWeekMonday);
            dayDate.setDate(dayDate.getDate() - dayDate.getDay() + 1 + i);
            dayCols.push(
                <DayColumn id={dayDate} key={dayDate} dayOnClick={this.props.dayOnClick}
                                    events={this.props.weekEventsList[i]} startTimeOnClick={this.props.startTimeOnClick}
                                    selectedDate={this.props.selectedDate} eventStartTime={this.props.eventStartTime}
                                    eventEndTime={this.props.eventEndTime} timeHighlight={this.props.timeHighlight} />
                                    )
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

class DayColumn extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.isBetweenSelectedTime = this.isBetweenSelectedTime.bind(this);
    }

    getHourCells() {
        var separators = [];
        for(var i = 0; i < 24; i++){
            var fullHour = i + ':00';
            var halfHour = i + ':30';
            var fullHourHighlight = this.isBetweenSelectedTime(fullHour);
            var halfHourHighlight = this.isBetweenSelectedTime(halfHour);
            separators.push(
                <div className='hour-cell' key={i}>
                    <HalfHourCell id={fullHour} highlight={fullHourHighlight} startTimeOnClick={this.props.startTimeOnClick}/>
                    <HalfHourCell id={halfHour} highlight={halfHourHighlight} startTimeOnClick={this.props.startTimeOnClick}/>
                </div>
            );
        }
        return separators;
    }

    parseDateAndTime(date, hourMin) {
        var date = new Date(date)
        var hourMin = hourMin.split(':');
        date.setHours(hourMin[0]);
        date.setMinutes(hourMin[1]);
        return date
    }

    isBetweenSelectedTime(cellTime) {
        var selectedStartDateTime = this.parseDateAndTime(this.props.selectedDate, this.props.eventStartTime);
        var selectedEndDateTime = this.parseDateAndTime(this.props.selectedDate, this.props.eventEndTime);
        var cellDateTime = this.parseDateAndTime(this.props.id, cellTime);

        return (cellDateTime >= selectedStartDateTime && cellDateTime < selectedEndDateTime && this.props.timeHighlight);
    }

    handleClick() {
        this.props.dayOnClick(this.props.id);
    }

    render() {
        let separators = this.getHourCells();
        return(
            <td className="day-col">
                <div className="day-col-events" onClick={this.handleClick}>
                    <EventsContainer events={this.props.events}/>
                    {separators}
                </div>
            </td>
        )
    }
}

class HalfHourCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        var timeSelected = this.props.id.toString();
        this.props.startTimeOnClick(timeSelected);
    }

    render() {
        var className = this.props.highlight ? 'hour-cell-split selected' : 'hour-cell-split'
        return (
            <div className={className} onClick={this.handleClick}></div>
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
