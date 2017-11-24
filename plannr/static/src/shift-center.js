import React from 'react';
import ReactDOM from 'react-dom';
import {getCookie} from './shared/getCookie';
import '../css/shift-center.css';
import {isManager} from './shared/isManager';

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
            <div>
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
                <CurrentShifts shifts={this.props.shifts.current_shifts} loadShifts={this.props.loadShifts} />
                <SearchingShifts shifts={this.props.shifts.searching} loadShifts={this.props.loadShifts} />
                <WaitingApprovalShifts shifts={this.props.shifts.waiting_approval} loadShifts={this.props.loadShifts} isManager={this.props.isManager} />
            </div>
        )
    }
}

class CurrentShifts extends React.Component {
    constructor(props) {
        super(props);
        this.buttonText = 'Look for Replacement';
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
                            handleClick={this.handleSearch} buttonText={this.buttonText} />
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
        var showButton = false;
        var shifts = this.props.shifts.slice(0);
        for(var i = 0; i < shifts.length; i++) {
            showButton = !shifts[i].is_current_user
            shiftBlocks.push(
                <ShiftBlock id={shifts[i].shift_detail.id} key={shifts[i].shift_detail.id}
                            shift={shifts[i].shift} shift_detail={shifts[i].shift_detail}
                            handleClick={this.handleRequest} buttonText={this.buttonText}
                            currentProfile={shifts[i].current_profile} showButton={showButton}/>
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
                            handleClick={this.handleApproval} showButton={this.props.isManager}
                            buttonText={this.buttonText} currentProfile={shifts[i].current_profile}
                            interestedProfile={shifts[i].interested_profile} />
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
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        if (this.props.shift) {
            this.props.handleClick(this.props.shift.id);
        } else {
            this.props.handleClick(this.props.shift_detail.id)
        }
    }

    render() {
        var button = null;
        var currentEmployeeName = null;
        var interestedEmployeeName = null;

        if(this.props.showButton) {
            button = <button className="plannr-btn btn" onClick={this.onClick}>{this.props.buttonText}</button>;
        }

        if(this.props.currentProfile) {
            currentEmployeeName = <div><b>Current:</b> {this.props.currentProfile.first_name}, {this.props.currentProfile.last_name}</div>
        }

        if(this.props.interestedProfile) {
            interestedEmployeeName = <div><b>Interested:</b> {this.props.interestedProfile.first_name}, {this.props.interestedProfile.last_name}</div>
        }

        return(
            <div className="event-card">
                <h3><u>{this.props.shift_detail.title}</u></h3>
                <ul className="list-unstyled">
                    <li>
                        <p><b>Starts:</b> {this.props.shift_detail.start_date}</p>
                    </li>
                    <li>
                        <p><b>Ends:</b> {this.props.shift_detail.end_date}</p>
                    </li>
                    <li>
                        {currentEmployeeName}
                    </li>
                    <li>
                        {interestedEmployeeName}
                    </li>
                    <li>
                        {button}
                    </li>
                </ul>
            </div>
        )
    }
}

ShiftBlock.defaultProps = {
    showButton: true,
    currentProfile: null,
    interestedProfile: null
}


export default ShiftCenter
