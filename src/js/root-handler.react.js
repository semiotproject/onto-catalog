"use strict";

let React = require('react');

import { RouteHandler } from 'react-router';
let Breadcrumbs = require('react-breadcrumbs');

export default class Root extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        return (
            <div>
                <RouteHandler></RouteHandler>
            </div>
        );
    }
}
