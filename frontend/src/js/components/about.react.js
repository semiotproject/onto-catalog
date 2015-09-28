"use strict";

import React from 'react';

export default class About extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        return (
            <div className="app-wrapper">
                <div className="container fluid">
                    About page
                </div>
            </div>
        );
    }
}