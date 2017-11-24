import React from 'react';
import ReactDOM from 'react-dom';

class EventList extends React.Component {

    render() {
        var eventComponents = this.props.dayEventList.map(function(event) {
            var start_date = new Date(event.start_date).toLocaleString();
            var end_date = new Date(event.end_date).toLocaleString();
            return(
                <div className="event-card" key={event.id}>
                    <h3><u>{event.title}</u></h3>
                    <ul className="list-unstyled">
                        <li>
                            <p><b>Starts:</b> {start_date}</p>
                        </li>
                        <li>
                            <p><b>Ends:</b> {end_date}</p>
                        </li>
                        <li>
                            <p><b>Employee:</b>  {event.employee_profile.first_name} {event.employee_profile.last_name}</p>
                        </li>
                    </ul>
                </div>
            )
        });
        return (
            <div className="event-list">
                {eventComponents}
            </div>);
    }
}

export default EventList
