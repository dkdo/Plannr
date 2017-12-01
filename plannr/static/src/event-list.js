import React from 'react';
import ReactDOM from 'react-dom';
import EventDetail from './event-detail';
import AlertDismissable from './alert-dismissable.js';

class EventList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false,
        }
        this.alertDismiss = this.alertDismiss.bind(this);
        this.deleteSuccess = this.deleteSuccess.bind(this);
    }

    deleteSuccess() {
        this.setState({showAlert: true});
    }

    alertDismiss() {
        this.setState({showAlert: false});
    }

    render() {
        var eventComponents = [];
        for(let i = 0; i < this.props.dayEventList.length; i++){
            eventComponents.push(<EventCard key={this.props.dayEventList[i].id} event={this.props.dayEventList[i]} refreshPage={this.props.refreshPage}
                                            deleteSuccess={this.deleteSuccess}/>);
        }

        return (
            <div className="event-list">
                <AlertDismissable alertVisible={this.state.showAlert} bsStyle="success" headline="Success!" alertText="Deleted Shift!"
                                      alertDismiss={this.alertDismiss}/>
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
        this.props.deleteSuccess();
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
