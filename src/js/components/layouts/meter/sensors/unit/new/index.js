"use strict";

let React = require('react');

import { Link } from 'react-router';

export default class NewSensorUnitTab extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        return (
            <div className="container content">
                <div className="row">
                    <Link to="Humidity" >
                        <div className="col-md-6">
                            <button className="big">
                                Humidity
                            </button>
                        </div>
                    </Link> 
                    <Link to="Heat" >
                        <div className="col-md-6">
                            <button className="big">
                                Heat
                            </button>
                        </div>
                    </Link>  
                </div>
            </div>
        );
    }
}
