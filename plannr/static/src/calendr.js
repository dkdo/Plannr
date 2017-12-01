import React from 'react';
import ReactDOM from 'react-dom';
import calendrConst from './shared/calendr-const';
import AddEventContainer from './add-event';
import EventList from './event-list';
import SalaryContainer from './salary';
import salaryConst from './shared/salary-const';
import EventDetail from './event-detail';
import { isManager } from './shared/isManager';
import AlertDismissable from './alert-dismissable.js';
import '../css/calendr-month.css';

class Calendr extends React.Component {
    constructor(props){
        super(props);
        var date = new Date();
        this.state = {
            year: date.getFullYear(),
            month: date.getMonth(),
            selectedYear: date.getFullYear(),
            selectedMonth: date.getMonth(),
            selectedDate: date.getDate(),
            selectedDt: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            startDay: 1,
            weekNumbers: false,
            minDate: this.props.minDate ? this.props.minDate : null,
            disablePast: this.props.disablePast ? this.props.disablePast : false,
            firstOfMonth: null,
            daysInMonth: null,
            dayEventList: [],
            monthEventList: [],
            eventTitle: '',
            eventStartTime: '0:00',
            eventEndTime: '0:30',
            isManager: false,
            showAlert: false,
        }

        this.calc = this.calc.bind(this);
        this.getPrev = this.getPrev.bind(this);
        this.getNext = this.getNext.bind(this);
        this.selectDate = this.selectDate.bind(this);
        this.titleChange = this.titleChange.bind(this);
        this.startTimeChange = this.startTimeChange.bind(this);
        this.endTimeChange = this.endTimeChange.bind(this);
        this.loadMonthEvents = this.loadMonthEvents.bind(this);
        this.addEventCallback = this.addEventCallback.bind(this);
        this.refreshPage = this.refreshPage.bind(this);
        this.alertDismiss = this.alertDismiss.bind(this);
        this.deleteSuccess = this.deleteSuccess.bind(this);
    }

    calc(year, month) {
        if (this.state.selectedElement) {
            if (this.state.selectedMonth != month || this.state.selectedYear != year) {
                this.state.selectedElement.classList.remove('r-selected');
            } else {
                this.state.selectedElement.classList.add('r-selected');
            }
        }
        return {
            firstOfMonth: new Date(year, month, 1),
            daysInMonth: new Date(year, month + 1, 0).getDate()
        };
    }

    componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
        this.setState(this.calc.call(null, this.state.year, this.state.month));
        this.loadMonthEvents();
        this.loadDateEvents(this.getSelectedDate().toISOString());
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.onSelect && prevState.selectedDt != this.state.selectedDt) {
            this.props.onSelect.call(this.getDOMNode(), this.state);
        }
    }

    refreshPage() {
        this.loadMonthEvents();
        this.loadDateEvents(this.getSelectedDate().toISOString());
    }

    deleteSuccess() {
        this.setState({showAlert: true});
    }

    alertDismiss() {
        this.setState({showAlert: false});
    }

    getPrev() {
        var state = {};
        if (this.state.month > 0) {
            state.month = this.state.month - 1;
            state.selectedMonth = state.month;
            state.year = this.state.year;
            state.selectedYear = state.year;
        } else {
            state.month = 11;
            state.selectedMonth = state.month;
            state.year = this.state.year - 1;
            state.selectedYear = state.year;
        }
        Object.assign(state, this.calc.call(null, state.year, state.month));
        this.setState(state, () => {
            this.loadMonthEvents();
            this.loadDateEvents(this.getSelectedDate().toISOString());
        });
    }

    getNext() {
        var state = {};
        if (this.state.month < 11) {
            state.month = this.state.month + 1;
            state.selectedMonth = state.month;
            state.year = this.state.year;
            state.selectedYear = state.year;
        } else {
            state.month = 0;
            state.selectedMonth = state.month;
            state.year = this.state.year + 1;
            state.selectedYear = state.year;
        }
        Object.assign(state, this.calc.call(null, state.year, state.month));
        this.setState(state, () => {
            this.loadMonthEvents();
            this.loadDateEvents(this.getSelectedDate().toISOString());
        });
    }

    loadDateEvents(date){
        var data = {
            start_date: date
        }
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                this.setState({
                    dayEventList: data
                });
            }.bind(this)
        })
    }

    loadMonthEvents() {
        var date = new Date(this.state.year, this.state.month, 1, 0, 0, 0).toISOString();
        var data = {
            month_date: date
        }
        $.ajax({
            type: 'GET',
            url: this.props.url_month,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                this.setState({
                    monthEventList: data
                });
                console.log(data);
            }.bind(this)
        })
    }

    addEventCallback(event) {
        var dayEventList = this.state.dayEventList;
        dayEventList.push(event);
        this.setState({dayEventList: dayEventList});
        this.loadMonthEvents();
    }

    selectDate(year, month, date, element) {
        if (this.state.selectedElement) {
            this.state.selectedElement.classList.remove('r-selected');
        }
        element.target.classList.add('r-selected');
        var dateObject = new Date(year, month, date, 0, 0, 0).toISOString();
        this.loadDateEvents(dateObject);
        this.setState({
            selectedYear: year,
            selectedMonth: month,
            selectedDate: date,
            selectedDt: new Date(year, month, date),
            selectedElement: element.target
        });
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

    getSelectedDate(){
        var dateMonth = this.state.selectedMonth;
        dateMonth = ('0' + dateMonth).slice(-2);
        var dateDay = this.state.selectedDate;
        dateDay = ('0' + dateDay).slice(-2);
        var date = new Date(this.state.selectedYear, dateMonth, dateDay, 0, 0,0);
        return date;
    }

    render() {
        let managerClass = this.state.isManager ? 'ismanager' : null;
        return (
            <div className="calendar-event-container row">
                <AlertDismissable alertVisible={this.state.showAlert} bsStyle="success" headline="Success!" alertText="Deleted shift!"
                                  alertDismiss={this.alertDismiss}/>
                <div className="col-xs-9">
                    <div className="r-calendar">
                        <div className="r-outer">
                            <div className="r-inner">
                                <Header monthNames={calendrConst.monthNamesFull} month={this.state.month} year={this.state.year}
                                        onPrev={this.getPrev} onNext={this.getNext}/>
                                <div className="calendar-table">
                                    <WeekDays dayNames={calendrConst.dayNames} weekNumbers={this.state.weekNumbers} />
                                    <MonthDates month={this.state.month} year={this.state.year} daysInMonth={this.state.daysInMonth} firstOfMonth={this.state.firstOfMonth}
                                        startDay={this.state.startDay} onSelect={this.selectDate} weekNumbers={this.state.weekNumbers} disablePast={this.state.disablePast}
                                        minDate={this.state.minDate} monthEventList={this.state.monthEventList} selectedDate={this.state.selectedDt}
                                        refreshPage={this.refreshPage} deleteSuccess={this.deleteSuccess}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <table className="calendar-modules col-xs-3" ref={(addEventComp) => {this.addEventComp = addEventComp}} >
                    <tbody>
                        <tr>
                            <td>
                                <SalaryContainer type={salaryConst.monthSalary} selectedDate={new Date(this.state.year, this.state.month, 1)} />
                                <AddEventContainer selectedDate={this.state.selectedDt} addEventCallback={this.addEventCallback}
                                                   eventStartTime={this.state.eventStartTime} eventEndTime={this.state.eventEndTime} eventTitle={this.state.eventTitle}
                                                   startTimeChange={this.startTimeChange} endTimeChange={this.endTimeChange} titleChange={this.titleChange}
                                                   events={this.state.dayEventList}/>
                            </td>
                        </tr>
                        <tr>
                            <td className={managerClass}>
                                <div className="calendar-subtitle"><b>Shifts</b></div>
                                <EventList dayEventList={this.state.dayEventList} refreshPage={this.refreshPage}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}

Calendr.defaultProps = {
    url: '/events/',
    url_month: '/events/monthevents/'
};

 class Arrows extends React.Component {
    render() {
        return (
            <div className="r-arrows">
                <div className="glyphicon glyphicon-chevron-left" onClick={this.props.onPrev.bind(null, this)} role="button" tabIndex="0"></div>
                <div className="glyphicon glyphicon-chevron-right" onClick={this.props.onNext.bind(null, this)} role="button" tabIndex="0"></div>
            </div>
        );
    }
}

class Header extends React.Component {
    render() {
        return (
            <div className="calendar-header">
                <Arrows onPrev={this.props.onPrev} onNext={this.props.onNext}/>
                <div className="calendar-title">{calendrConst.monthNamesFull[this.props.month]}&nbsp;{this.props.year}</div>
            </div>
        );
    }
}

class WeekDays extends React.Component {
    render() {
        var that = this,
            haystack = Array.apply(null, {length: 7}).map(Number.call, Number);
        return (
            <div className="r-row r-weekdays">
                {(() => {
                    if (that.props.weekNumbers) {
                        return (
                            <div className="r-cell r-weeknum">wn</div>
                        );
                    }
                })()}
                {haystack.map(function (item, i) {
                    return (
                        <div key={i} className="r-cell r-weekday">{that.props.dayNames[i % 7]}</div>
                    );
                })}
            </div>
        );
    }
}

class MonthDates extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        }
        this.hasEvents = this.hasEvents.bind(this);
    }

    hasEvents(events) {
        return (events !== undefined && events.length > 0);
    }

    render() {
        var haystack, day, d, current, onClick,
            isDate, className,
            weekStack = Array.apply(null, {length: 7}).map(Number.call, Number),
            that = this,
            startDay = this.props.firstOfMonth.getUTCDay(),
            first = this.props.firstOfMonth.getDay(),
            janOne = new Date(that.props.year, 0, 1),
            rows = 5;

        var monthEventList = this.props.monthEventList;
        var selectedDate = (new Date(this.props.selectedDate)).getDate();
        var refreshPage = this.props.refreshPage;
        var deleteSuccess = this.props.deleteSuccess;

        if ((startDay == 6 && this.props.daysInMonth == 31) || ((startDay == 0 || startDay == 6) && this.props.daysInMonth > 29)) {
            rows = 6;
        }

        className = rows === 6 ? 'r-dates' : 'r-dates r-fix';
        haystack = Array.apply(null, {length: rows}).map(Number.call, Number);
        day = this.props.startDay + 1 - first;
        while (day > 1) {
            day -= 7;
        }
        day -= 1;
        return (
            <div key={day} className={className}>
            {haystack.map(function (item, i) {
                d = day + i * 7;
                return (
                    <div key={d} className="r-row">
                    {(() => {
                        if (that.props.weekNumbers) {
                            var wn = Math.ceil((((new Date(that.props.year, that.props.month, d) - janOne) / 86400000) + janOne.getDay() + 1) / 7);
                            return (
                                <div key={wn} className="r-cell r-weeknum">{wn}</div>
                            );
                        }
                    })()}
                    {weekStack.map(function (item, i) {
                        d += 1;
                        isDate = d > 0 && d <= that.props.daysInMonth;

                        if (isDate) {
                            current = new Date(that.props.year, that.props.month, d);
                            className = current != that.constructor.today ? 'r-cell r-date' : 'r-cell r-date r-today';
                            className = d === selectedDate ? className + ' r-selected' : className;
                            if (that.props.disablePast && current < that.constructor.today) {
                                className += ' r-past';
                            } else if (that.props.minDate !== null && current < that.props.minDate) {
                                className += ' r-past';
                            }

                            // if(this.props.monthEventList[d] !== undefined && this.props.monthEventList[d].length > 0) {
                            if(monthEventList[d] !== undefined && monthEventList.length > 0) {
                                var events = monthEventList[d];
                                var eventPoints = [];
                                var limit = events.length > 4 ? 4 : events.length;

                                for(var i = 0; i < limit; i ++){
                                    var eventBlock = <EventPoint event={events[i]} key={events[i].id} refreshPage={refreshPage}
                                                                 deleteSuccess={deleteSuccess}/>
                                    eventPoints.push(eventBlock)
                                }

                                if(events.length > 4) {
                                    eventPoints.push(<div key={d} className="more-events">...</div>)
                                }
                            }

                            if (/r-past/.test(className)) {
                                return (
                                    <div key={d} className={className} role="button" tabIndex="0">
                                        <div className="day-number">{d}</div>
                                        <div className="event-points">{eventPoints}</div>
                                    </div>
                                );
                            }

                            return (
                                // Change the bind, it always rerenders
                                <div key={d} className={className} role="button" tabIndex="0" onClick={that.props.onSelect.bind(null, that.props.year, that.props.month, d)}>
                                    <div className="day-number">{d}</div>
                                    <div className="event-points">{eventPoints}</div>
                                </div>
                            );
                        }

                        return (
                            <div key={d} className="r-cell"></div>
                        );
                    })}
                    </div>
                );
            })}
            </div>
        );
    }
}

class EventPoint extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
        }
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.deleteCallback = this.deleteCallback.bind(this);
    }

    openModal() {
        this.setState({showModal: true});
    }

    deleteCallback() {
        this.props.refreshPage();
        this.props.deleteSuccess();
    }

    closeModal() {
        this.setState({showModal: false});
    }

    render() {
        return (
            <div className="calendar-event">
                <div className="event-point"></div>
                <div className="event-title" onDoubleClick={this.openModal}>{this.props.event.title}</div>
                <EventDetail event={this.props.event} showModal={this.state.showModal} closeModal={this.closeModal} deleteCallback={this.deleteCallback}/>
            </div>
        )
    }
}

MonthDates.defaultProps = {
    today: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
};

export default Calendr
