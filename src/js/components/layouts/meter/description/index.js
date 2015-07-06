"use strict";

let React = require('react');

import { Link } from 'react-router';

export default class DescriptionTab extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }    

    render() {
        return (
            <div>
                <Link to={"Manufacture"} >
                    <div className="col-md-4">
                        <button className="big">
                            Manufacture
                        </button>
                    </div>
                </Link> 
                <Link to={"Deployment"} >
                    <div className="col-md-4">
                        <button className="big">
                            Deployment
                        </button>
                    </div>
                </Link> 
                <Link to={"Drivers"} >
                    <div className="col-md-4">
                        <button className="big inactive">
                            Drivers
                        </button>
                    </div>
                </Link> 
            </div>
        );
    }
}
