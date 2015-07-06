"use strict";

let React = require('react');

import { Link, RouteHandler } from 'react-router';
import Store from '../../stores/description-store';

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
    handleClick(type) {
        return () => {
            switch (type) {
                case 'meter':
                    Store.initMeter();
                    return;
                default:
                    break;
            }
        }
    }

    // common helpers
    

    // render helpers
    

    render() {
        return (            
            <div>
                <div className="row">
                    <Link to="Meter" >
                        <div className="col-md-6">
                            <button className="big" onClick={this.handleClick('meter')}>
                                Meter
                            </button>
                        </div>
                    </Link> 
                    <div className="col-md-6">
                        <button className="big inactive" onClick={this.handleClick('actuator')}>
                            Actuators
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
