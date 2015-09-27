"use strict";

import React from 'react';
import { Component } from 'react';
import { RouteHandler } from 'react-router';

export default class ClassView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            {this.props.children}
        </div>;
    }
}