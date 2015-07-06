"use strict";

let React = require('react');

import { Link } from 'react-router';

let Breadcrumbs = require('react-breadcrumbs');

export default class SensorUnitsTab extends React.Component {

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
            <div>
                <div className="container content">
                    <Link to={"New sensor"} >
                        <div className="col-md-4">
                            <button className="big">
                                Add more
                            </button>
                        </div>
                    </Link> 
                    {[0, 1, 2, 3].map((item) => {
                        return (
                            <Link to={"Sensor unit"} key={item} params={{ id: item }} >
                                <div className="col-md-4">
                                    <button className="big">
                                        {item}
                                    </button>
                                </div>
                            </Link> 
                        );
                    })}
                </div>
            </div>
        );
    }
}
