"use strict";

let React = require('react');

import { Link } from 'react-router';

export default class Heat extends React.Component {

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
                    Heat
                </div>
            </div>
        );
    }
}
