import React from 'react';
import ReactDOM from 'react-dom';

class Employees extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
   }

    render() {
        return (
            <div>EMPLOYEES BOIS</div>
        )
    }
}

Employees.defaultProps = {
    url: '/'
};

export default Employees 
