import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import eventModal from './shared/eventModal';
import {getCookie} from './shared/getCookie';
import { isManager } from './shared/isManager';
import '../css/event-detail.css'

class EventDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isManager: false,
        }
        this.deleteEvent = this.deleteEvent.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    componentWillMount() {
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
    }

    closeModal() {
        this.props.closeModal();
    }

    deleteEvent() {
        var data = {event_id: this.props.event.id}
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        $.ajax({
            url: this.props.url,
            type: 'DELETE',
            datatype: 'json',
            cache: false,
            data: data,
            success: function(data){
                this.props.deleteCallback();
            }.bind(this)
        })
    }

    render() {
        let startDate = new Date(this.props.event.start_date).toLocaleString();
        let endDate = new Date(this.props.event.end_date).toLocaleString();
        return (
                <Modal
                    isOpen={this.props.showModal}
                    onRequestClose={this.closeModal}
                    contentLabel="Modal"
                    style={eventModal}>
                    <div className="event-modal">
                        <h1 className="modal-title">Event Detail</h1>
                        <div>
                            <b>Title: </b><span>{this.props.event.title}</span>
                        </div>
                        <div>
                            <b>Start date: </b><span>{startDate}</span>
                        </div>
                        <div>
                            <b>End date: </b><span>{endDate}</span>
                        </div>
                        <div>
                            <b>Employee: </b><span>{this.props.event.employee_profile.first_name} {this.props.event.employee_profile.last_name}</span>
                        </div>
                        <div className="modal-btns">
                            <button className="plannr-btn btn" onClick={this.deleteEvent} disabled={!this.state.isManager}>Delete</button>
                            <button className="plannr-btn btn" onClick={this.closeModal}>Cancel</button>
                        </div>
                    </div>
                </Modal>
        )
    }
}

EventDetail.defaultProps = {
    url: '/events/eventdetail/',
};

export default EventDetail
