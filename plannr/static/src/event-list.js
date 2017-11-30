import React from 'react';
import ReactDOM from 'react-dom';
import EventDetail from './event-detail';

class EventList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        var eventComponents = this.props.dayEventList.map(function(event) {
            return(
                <EventCard key={event.id} event={event} />
            )
        });
        return (
            <div className="event-list">
                {eventComponents}
            </div>);
    }
}

class EventCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
        this.openModal = this.openModal.bind(this);
        this.deleteCallback = this.deleteCallback.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    openModal() {
        this.setState({showModal: true});
    }

    deleteCallback() {
        this.props.refreshPage();
    }

    closeModal() {
        this.setState({showModal: false});
    }

    render() {
        var start_date = new Date(this.props.event.start_date).toLocaleString();
        var end_date = new Date(this.props.event.end_date).toLocaleString();
        return(
            <div className="event-card" key={this.props.event.id} onDoubleClick={this.openModal}>
                <h3 className="event-title" title={this.props.event.title}>{this.props.event.title}</h3>
                <ul className="list-unstyled">
                    <li>
                        <p><b>Starts:</b> {start_date}</p>
                    </li>
                    <li>
                        <p><b>Ends:</b> {end_date}</p>
                    </li>
                    <li>
                        <p><b>Employee:</b>  {this.props.event.employee_profile.first_name} {this.props.event.employee_profile.last_name}</p>
                    </li>
                </ul>
                <EventDetail event={this.props.event} showModal={this.state.showModal} closeModal={this.closeModal} deleteCallback={this.deleteCallback}/>
            </div>
        )
    }
}

export default EventList
