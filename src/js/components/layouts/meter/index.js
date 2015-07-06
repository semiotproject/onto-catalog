"use strict";

let React = require('react');

import { Link } from 'react-router';

let Breadcrumbs = require('react-breadcrumbs');

export default class SensorTab extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    // lifecycle methods
    componentWillMount() {

    }
    componentDidMount() {
        
    }
    componentWillReceiveProps(nextProps) {
        
    }
    componentWillUpdate(nextProps, nextState) {
        
    }
    componentDidUpdate(prevProps, prevState) {
        
    }
    componentWillUnmount() {
        
    }
    

    // UI and stores handlers
    

    // common helpers
    

    // render helpers
    

    render() {
        return (
            <div className="container content">
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
