import React from 'react';
import ReactDOM from 'react-dom';
import Alert from 'react-bootstrap/lib/Alert';
import '../css/alert.css';

class AlertDismissable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
        this.handleAlertDismiss = this.handleAlertDismiss.bind(this);
    }

    handleAlertDismiss() {
        this.props.alertDismiss();
    }

    render() {
        if (this.props.alertVisible) {
            return (
                <div className="alert-top">
                    <Alert bsStyle={this.props.bsStyle} onDismiss={this.handleAlertDismiss}>
                        <h4>{this.props.headline}</h4>
                        <p>{this.props.alertText}</p>
                    </Alert>
                </div>
            )
        }

        return(
            <div></div>
        )
    }
}

export default AlertDismissable
