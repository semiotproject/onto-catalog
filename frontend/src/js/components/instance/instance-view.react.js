"use strict";

import React from 'react';

export default class InstanceView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };

        // ex-componentWillMount hooks

        // UI and stores handlers declaration


    }

    // common helpers


    // render helpers
    renderMiniMap() {
        return <div></div>;
    }
    renderView() {
        return <div></div>;
    }

    render() {
        return (
            <div className="app-container">
                {this.renderMiniMap()}
                {this.renderView()}
            </div>
        );
    }
}

InstanceView.propTypes = {

};

InstanceView.defaultProps = {

};
