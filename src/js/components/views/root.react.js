"use strict";

let React = require('react');

import ManufactureView from './manufacture.react';
import DeploymentView from './deployment.react';
import SensorsView from './sensors.react';
import ActuatorsView from './actuators.react';

import ViewStore from '../../stores/view-store';

export default class RootView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }


    // UI and stores handlers
    handleClick(Component) {
        return () => {
            ViewStore.setView(Component);
        }
    }

    // common helpers


    // render helpers


    render() {
        return (
            <div>
                <header>Device</header>
                <div className="row">
                    <div className="col-md-6">
                        <button className="big" onClick={this.handleClick(ManufactureView)}>
                            Manufacture
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="big" onClick={this.handleClick(DeploymentView)}>
                            Deployment
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="big" onClick={this.handleClick(SensorsView)}>
                            Sensors
                        </button>
                    </div>
                    <div className="col-md-6">
                        <button className="big inactive" onClick={this.handleClick(ActuatorsView)}>
                            Actuators
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
