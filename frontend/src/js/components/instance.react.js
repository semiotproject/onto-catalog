"use strict";

import React from 'react';
import { Link } from 'react-router';

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
            <div className="app-wrapper">
                <div className="app-header">
                    <div>
                        <Link to="/model/">
                            <button className="btn btn-primary" style={{
                                position: "absolute",
                                left: "20px",
                                top: "30px"
                            }}><i className="fa fa-arrow-circle-left"></i> Back</button>
                        </Link>
                        <h3>InstanceView View</h3>
                        <p>Generate description based on one of device models</p>
                    </div>
                </div>
                <div className="app-container">
                    {this.renderMiniMap()}
                    {this.renderView()}
                </div>
            </div>
        );
    }
}

InstanceView.propTypes = {

};

InstanceView.defaultProps = {

};
