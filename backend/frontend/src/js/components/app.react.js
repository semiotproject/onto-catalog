"use strict";

import React from 'react';
import { Component } from 'react';
import { RouteHandler } from 'react-router';
import Navigation from './nav.react';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="main-wrapper">
                <div id="nav">
                    <Navigation path={this.props.location.pathname}/>
                </div>
                <div id="app-wrapper">
                    {this.props.children}
                </div>
            </div>
        );
    }
}