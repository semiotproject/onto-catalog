"use strict";

let React = require('react');

export default class SensorUnit extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        return (
            <div>
                SensorUnit {this.props.id}
            </div>
        );
    }
}
