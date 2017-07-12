// main.js
var React = require('react');
var ReactDOM = require('react-dom');

var Calendar = React.createClass({
    calc: function (year, month) {
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
    },
    loadEventsFromServer: function(){
        $.ajax({
            url: this.props.url,
            datatype: 'json',
            cache: false,
            success: function(data){
                this.setState({data: data});
            }.bind(this)
        })
    },
    componentWillMount: function () {
        this.setState(this.calc.call(null, this.state.year, this.state.month));
    },
    componentDidMount: function () {
        this.loadEventsFromServer();
    },
    componentDidUpdate: function (prevProps, prevState) {
        if (this.props.onSelect && prevState.selectedDt != this.state.selectedDt) {
            this.props.onSelect.call(this.getDOMNode(), this.state);
        }
    },
    getInitialState: function () {
        var date = new Date();
        return {
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
            dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            monthNamesFull: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            firstOfMonth: null,
            daysInMonth: null,
            eventList: [],
            eventTitle: ''
        };
    },
    getPrev: function () {
        var state = {};
        if (this.state.month > 0) {
            state.month = this.state.month - 1;
            state.year = this.state.year;
        } else {
            state.month = 11;
            state.year = this.state.year - 1;
        }
        Object.assign(state, this.calc.call(null, state.year, state.month));
        this.setState(state);
    },
    getNext: function () {
        var state = {};
        if (this.state.month < 11) {
            state.month = this.state.month + 1;
            state.year = this.state.year;
        } else {
            state.month = 0;
            state.year = this.state.year + 1;
        }
        Object.assign(state, this.calc.call(null, state.year, state.month));
        this.setState(state);
    },
    selectDate: function (year, month, date, element) {
        if (this.state.selectedElement) {
            this.state.selectedElement.classList.remove('r-selected');
        }
        element.target.classList.add('r-selected');
        this.loadEventsFromServer();
        var dateObject = new Date(year, month, date);
        dateObject.setHours(0,0,0,0);
        var events = [];
        for (var key in this.state.data) {
            var event = this.state.data[key];
            var eventDate = new Date(event.date);
            eventDate.setHours(0,0,0,0);
            eventDate.setDate(eventDate.getDay()+3);
            if (eventDate.valueOf() == dateObject.valueOf()) {
                events.push(event);
            }
        }
        this.setState({
            selectedYear: year,
            selectedMonth: month,
            selectedDate: date,
            selectedDt: new Date(year, month, date),
            selectedElement: element.target,
            eventList: events
        });
        console.log(events);
    },
    titleChange: function(event) {
        this.setState({eventTitle: event.target.value});
    },
    addEvent: function (){
        if (this.state.eventTitle == ''){
            alert('Select a date and/or add a title!');
        }
        else{
            var dateMonth = this.state.selectedMonth + 1;
            dateMonth = ("0" + dateMonth).slice(-2);
            var dateDay = this.state.selectedDate;
            dateDay = ("0" + dateDay).slice(-2);
            var date = [this.state.selectedYear, dateMonth, dateDay].join('-');
            console.log(date);
            var data = {
                title: this.state.eventTitle,
                date: date
            }
            $.ajax({
                type: 'POST',
                url: this.props.url,
                data: data,
                datatype: 'json',
                cache: false,
                success: function(data){
                    var events = this.state.eventList;
                    events.push(data);
                    this.setState({eventList: events});
                }.bind(this)
            })
            this.setState({eventTitle: ''});
        }
    },
    render: function () {
        return (
            <div className="calendar-event-container">
                <div className="left-position-pane">
                    <div className="r-calendar">
                        <div className="r-outer">
                            <Arrows onPrev={this.getPrev} onNext={this.getNext}/>
                            <div className="r-inner">
                                <Header monthNames={this.state.monthNamesFull} month={this.state.month} year={this.state.year} />
                                <WeekDays dayNames={this.state.dayNames} startDay={this.state.startDay} weekNumbers={this.state.weekNumbers} />
                                <MonthDates month={this.state.month} year={this.state.year} daysInMonth={this.state.daysInMonth} firstOfMonth={this.state.firstOfMonth} startDay={this.state.startDay} onSelect={this.selectDate} weekNumbers={this.state.weekNumbers} disablePast={this.state.disablePast} minDate={this.state.minDate} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-position-pane">
                    <EventList eventList={this.state.eventList}/>
                    <AddEvent eventTitle={this.state.eventTitle} titleChange={this.titleChange} addEvent={this.addEvent}/>
                </div>
            </div>
        );
    }
});

var EventList = React.createClass({
    render: function(){
        var eventComponents = this.props.eventList.map(function(event) {
            return <div className="event" key={event.id}>{event.title} {event.date}</div>
        });
        return <div className="eventList">{eventComponents}</div>;
    }
});

var AddEvent = React.createClass({
    render: function(){
        return (
            <div className="eventAdder">
                <div><label>Title </label><input type="text" value={this.props.eventTitle} onChange={this.props.titleChange}/></div>
                <div className="btn btn-default btn-md" onClick={this.props.addEvent.bind(null, this)} role="button">Add Event</div>
            </div>
        );
    }
});

var Arrows = React.createClass({
    render: function () {
        return (
            <div className="r-arrows r-row">
                <div className="r-cell r-prev" onClick={this.props.onPrev.bind(null, this)} role="button" tabIndex="0"></div>
                <div className="r-cell r-next" onClick={this.props.onNext.bind(null, this)} role="button" tabIndex="0"></div>
            </div>
        );
    }
});

var Header = React.createClass({
    render: function () {
        return (
            <div className="r-row r-head">
                <div className="r-cell r-title">{this.props.monthNames[this.props.month]}&nbsp;{this.props.year}</div>
            </div>
        );
    }
});

var WeekDays = React.createClass({
    render: function () {
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
                        <div className="r-cell">{that.props.dayNames[(that.props.startDay + i) % 7]}</div>
                    );
                })}
            </div>
        );
    }
});

var MonthDates = React.createClass({
    statics: {
        year: new Date().getFullYear(),
        month: new Date().getMonth(),
        date: new Date().getDate(),
        today: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
    },
    render: function () {
        var haystack, day, d, current, onClick,
            isDate, className,
            weekStack = Array.apply(null, {length: 7}).map(Number.call, Number),
            that = this,
            startDay = this.props.firstOfMonth.getUTCDay(),
            first = this.props.firstOfMonth.getDay(),
            janOne = new Date(that.props.year, 0, 1),
            rows = 5;

        if ((startDay == 5 && this.props.daysInMonth == 31) || (startDay == 6 && this.props.daysInMonth > 29)) {
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
            <div className={className}>
            {haystack.map(function (item, i) {
                d = day + i * 7;
                return (
                    <div className="r-row">
                    {(() => {
                        if (that.props.weekNumbers) {
                            var wn = Math.ceil((((new Date(that.props.year, that.props.month, d) - janOne) / 86400000) + janOne.getDay() + 1) / 7);
                            return (
                                <div className="r-cell r-weeknum">{wn}</div>
                            );
                        }
                    })()}
                    {weekStack.map(function (item, i) {
                        d += 1;
                        isDate = d > 0 && d <= that.props.daysInMonth;

                        if (isDate) {
                            current = new Date(that.props.year, that.props.month, d);
                            className = current != that.constructor.today ? 'r-cell r-date' : 'r-cell r-date r-today';
                            if (that.props.disablePast && current < that.constructor.today) {
                                className += ' r-past';
                            } else if (that.props.minDate !== null && current < that.props.minDate) {
                                className += ' r-past';
                            }

                            if (/r-past/.test(className)) {
                                return (
                                    <div className={className} role="button" tabIndex="0">{d}</div>
                                );
                            }

                            return (
                                <div className={className} role="button" tabIndex="0" onClick={that.props.onSelect.bind(null, that.props.year, that.props.month, d)}>{d}</div>
                            );
                        }

                        return (
                            <div className="r-cell"></div>
                        );
                    })}
                    </div>
                );
            })}
            </div>
        );
    }
});

ReactDOM.render(
    React.createElement(Calendar, {
        url: '/events/'
        //onSelect: function (state) {
            //console.log(this, state);
        //},
        //disablePast: true,
        //minDate: new Date(2016, 2, 28)
    }),
    document.getElementById("calendar")
);
