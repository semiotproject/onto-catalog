"use strict";

let React = require('react');

import { Link } from 'react-router';

export default class SensorTab extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <div className="row">
                    <Link to="Sensor units" >
                        <div className="col-md-6">
                            <button className="big">
                                Sensors
                            </button>
                        </div>
                    </Link> 
                    <Link to="Sensor description" >
                        <div className="col-md-6">
                            <button className="big">
                                Description
                            </button>
                        </div>
                    </Link> 
                </div>
            </div>
        );
    }
}
