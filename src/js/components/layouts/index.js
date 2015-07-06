"use strict";

let React = require('react');

import { Link, RouteHandler } from 'react-router';

let Breadcrumbs = require('react-breadcrumbs');

export default class MainTab extends React.Component {

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
                    <Link to="Meter" >
                        <div className="col-md-6">
                            <button className="big">
                                Meter
                            </button>
                        </div>
                    </Link> 
                    <div className="col-md-6">
                        <button className="big inactive">
                            Actuators
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
