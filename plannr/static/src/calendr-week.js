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
        }
    }

    render() {
        return (
            <div className="calendr-week">
                <div className="week-days">
                {this.state.dayNames.map((item, index) => (
                    <div className="week-day" key={item}>{item}</div>
                ))}
                </div>
            </div>
        )
    }
}

export default CalendrWeek