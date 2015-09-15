"use strict";

let React = require('react');

import ManufactureView from './manufacture.react';
import DeploymentView from './deployment.react';
import DriverView from './driver.react';

import ViewStore from '../../stores/view-store';

export default class DescriptionView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    handleSelect(Component) {
        return () => {
            ViewStore.setView(Component);
        };
    }

    render() {
        return (
            <div>
                <header>Description</header>
                <div className="col-md-4">
                    <button className="big" onClick={this.handleSelect(ManufactureView)}>
                        Manufacture
                    </button>
                </div>
                <div className="col-md-4">
                    <button className="big" onClick={this.handleSelect(DeploymentView)}>
                        Deployment
                    </button>
                </div>
                <div className="col-md-4">
                    <button className="big inactive" onClick={this.handleSelect(DriverView)}>
                        Drivers
                    </button>
                </div>
            </div>
        );
    }
}
