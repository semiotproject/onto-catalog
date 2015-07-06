"use strict";

let React = require('react');

import { Link } from 'react-router';

export default class Tab extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }    

    render() {
        return (
            <div>
                <div className="form-group">
                    <label for="">Driver adaptor</label>
                    <input type="text" className="form-control" />
                </div>
            </div>
        );
    }
}
