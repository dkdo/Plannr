import React from 'react';
import ReactDOM from 'react-dom';
import {getCookie} from './shared/getCookie';
import '../css/shift-center.css';
import {isManager} from './shared/isManager';
import Modal from 'react-modal';
import centerModal from './shared/centerModal';

class ShiftCenter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            shifts: {},
            isManager: false,
        }
        this.onShiftClick = this.onShiftClick.bind(this);
        this.loadShifts = this.loadShifts.bind(this);
    }

    componentWillMount() {
        this.loadShifts();
        isManager((isUserManager) => this.setState({isManager: isUserManager}));
    }

    loadShifts() {
        $.ajax({
            type: 'GET',
            url: this.props.searchUrl,
            datatype: 'json',
            cache: false,
            success: function(data){
                console.log(data);
                this.setState({shifts: data});
            }.bind(this)
        })
    }

    onShiftClick() {
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        $.ajax({
            type: 'POST',
            url: this.props.searchReplaceUrl,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
            }.bind(this)
        })
    }

    render() {
        return(
            <div className="shift-center">
                <h1 className="page-title">Shift Center</h1>
                <Shifts shifts={this.state.shifts} loadShifts={this.loadShifts} isManager={this.state.isManager}/>
            </div>
        )
    }
}

ShiftCenter.defaultProps = {
    searchUrl: '/shift/list/',
    searchReplaceUrl: '/shift/search_replace/'
}

class Shifts extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="row equal">
                <CurrentShifts shifts={this.props.shifts.current_shifts} loadShifts={this.props.loadShifts} userProfile={this.props.shifts.user_profile} />
                <SearchingShifts shifts={this.props.shifts.searching} loadShifts={this.props.loadShifts} isManager={this.props.isManager}/>
                <WaitingApprovalShifts shifts={this.props.shifts.waiting_approval} loadShifts={this.props.loadShifts} isManager={this.props.isManager} />
            </div>
        )
    }
}

class CurrentShifts extends React.Component {
    constructor(props) {
        super(props);
        this.buttonText = 'Look for Replacement';
        this.modalText = 'Do you wish to look for replacement for this shift?';
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(id) {
        var csrfToken = getCookie('csrftoken');
        var data = {event_id: id};
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        $.ajax({
            type: 'POST',
            url: this.props.searchUrl,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                this.props.loadShifts();
            }.bind(this)
        })
    }

    getCurrentShiftBlocks() {
        var shiftBlocks = [];
        var shifts = this.props.shifts.slice(0);
        for(var i = 0; i < shifts.length; i++){
            shiftBlocks.push(
                <ShiftBlock id={shifts[i].id} key={shifts[i].id} shift_detail={shifts[i]}
                            handleClick={this.handleSearch} buttonText={this.buttonText}
                            modalText={this.modalText} currentProfile={this.props.userProfile}/>
            )
        }
        return shiftBlocks;
    }

    render() {
        var shiftBlocks = null;
        if (this.props.shifts && this.props.shifts.length > 0){
            shiftBlocks = this.getCurrentShiftBlocks();
        }
        return(
            <div className="col-xs-4 shifts-col">
                <h2 className="sub-title">Your Shifts</h2>
                <div>{shiftBlocks}</div>
            </div>
        )
    }
}

CurrentShifts.defaultProps = {
    searchUrl: '/shift/search_replace/'
};

class SearchingShifts extends React.Component {
    constructor(props) {
        super(props);
        this.buttonText = 'Request';
        this.modalText = 'Do you wish to request this shift?';
        this.handleRequest = this.handleRequest.bind(this);
    }

    handleRequest(id) {
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        var data = {shift_id: id};
        $.ajax({
            type: 'PATCH',
            url: this.props.requestUrl,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                this.props.loadShifts();
            }.bind(this)
        })
    }

    getCurrentShiftBlocks() {
        var shiftBlocks = [];
        var enableButton = false;
        var shifts = this.props.shifts.slice(0);
        for(var i = 0; i < shifts.length; i++) {
            enableButton = !shifts[i].is_current_user && !this.props.isManager;
            shiftBlocks.push(
                <ShiftBlock id={shifts[i].shift_detail.id} key={shifts[i].shift_detail.id}
                            shift={shifts[i].shift} shift_detail={shifts[i].shift_detail}
                            handleClick={this.handleRequest} buttonText={this.buttonText}
                            currentProfile={shifts[i].current_profile} enableButton={enableButton}
                            modalText={this.modalText} />
            )
        }
        return shiftBlocks;
    }

    render() {
        var shiftBlocks = null;
        if (this.props.shifts && this.props.shifts.length > 0) {
            shiftBlocks = this.getCurrentShiftBlocks();
        }
        return(
            <div className="col-xs-4 shifts-col">
                <h2 className="sub-title">Available Shifts</h2>
                <div>{shiftBlocks}</div>
            </div>
        )
    }
}

SearchingShifts.defaultProps = {
    requestUrl: '/shift/replace_request/'
};

class WaitingApprovalShifts extends React.Component {
    constructor(props) {
        super(props);
        this.buttonText = 'Approve';
        this.modalText = 'Do you wish to approve this shift replacement?';
        this.handleApproval = this.handleApproval.bind(this);
    }

    handleApproval(id) {
        var csrfToken = getCookie('csrftoken');
        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader("X-CSRFToken", csrfToken);
            }
        });
        var data = {shift_id: id}
        $.ajax({
            type: 'PATCH',
            url: this.props.approvalUrl,
            datatype: 'json',
            data: data,
            cache: false,
            success: function(data){
                this.props.loadShifts();
            }.bind(this)
        })
    }

    getCurrentShiftBlocks() {
        var shiftBlocks = [];
        var shifts = this.props.shifts.slice(0);
        for(var i = 0; i < shifts.length; i++) {
            shiftBlocks.push(
                <ShiftBlock id={shifts[i].shift_detail.id} key={shifts[i].shift_detail.id}
                            shift={shifts[i].shift} shift_detail={shifts[i].shift_detail}
                            handleClick={this.handleApproval} enableButton={this.props.isManager}
                            buttonText={this.buttonText} currentProfile={shifts[i].current_profile}
                            interestedProfile={shifts[i].interested_profile}
                            modalText={this.modalText}/>
            )
        }
        return shiftBlocks;
    }

    render() {
        var shiftBlocks = null;
        if (this.props.shifts && this.props.shifts.length > 0) {
            shiftBlocks = this.getCurrentShiftBlocks();
        }
        return(
            <div className="col-xs-4 shifts-col">
                <h2 className="sub-title">To Be Approved</h2>
                <div>{shiftBlocks}</div>
            </div>
        )
    }
}

WaitingApprovalShifts.defaultProps = {
    approvalUrl: '/shift/manager_approve/'
};

class ShiftBlock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        }
        this.onClick = this.onClick.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    onClick() {
        if (this.props.shift) {
            this.props.handleClick(this.props.shift.id);
        } else {
            this.props.handleClick(this.props.shift_detail.id)
        }
    }

    openModal() {
        this.setState({showModal: true});
    }

    closeModal() {
        this.setState({showModal: false});
    }

    render() {
        var currentEmployeeName = null;
        var interestedEmployeeName = null;

        var button = <button className="plannr-btn btn" onClick={this.openModal} disabled={!this.props.enableButton}>{this.props.buttonText}</button>;

        if(this.props.currentProfile) {
            currentEmployeeName = this.props.currentProfile.first_name + ' ' + this.props.currentProfile.last_name;
        }

        if(this.props.interestedProfile) {
            interestedEmployeeName = this.props.interestedProfile.first_name + ' ' + this.props.interestedProfile.last_name;
        } else {
            interestedEmployeeName = "No one yet!";
        }

        return(
            <div className="event-card">
                <h3 className="event-title">{this.props.shift_detail.title}</h3>
                <ul className="list-unstyled">
                    <li>
                        <p><b>Starts:</b> {new Date(this.props.shift_detail.start_date).toLocaleString()}</p>
                    </li>
                    <li>
                        <p><b>Ends:</b> {new Date(this.props.shift_detail.end_date).toLocaleString()}</p>
                    </li>
                    <li>
                        <div><b>Current:</b> {currentEmployeeName}</div>
                    </li>
                    <li>
                        <div><b>Interested:</b> {interestedEmployeeName}</div>
                    </li>
                    <li>
                        {button}
                    </li>
                    <Modal
                        isOpen={this.state.showModal}
                        onRequestClose={this.closeModal}
                        contentLabel="Modal"
                        style={centerModal}>
                        <div>
                            <div className="modal-text">
                                {this.props.modalText}
                            </div>
                            <div className="modal-btns">
                                <button className="plannr-btn btn" onClick={this.onClick}>{this.props.buttonText}</button>
                                <button className="plannr-btn btn" onClick={this.closeModal}>Cancel</button>
                            </div>
                        </div>
                    </Modal>
                </ul>
            </div>
        )
    }
}

ShiftBlock.defaultProps = {
    enableButton: true,
    currentProfile: null,
    interestedProfile: null
}


export default ShiftCenter
