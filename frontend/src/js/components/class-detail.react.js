"use strict";

import React from 'react';
import $ from 'jquery';
import saveAs from 'browser-filesaver';

import RootView from './views/root.react.js';
import SensorsView from './views/sensors.react.js';
import SensorView from './views/sensor.react.js';
import ActuatorsView from './views/actuators.react.js';
import ActuatorView from './views/actuator.react.js';
import DescriptionView from './views/description.react.js';
import ManufactureView from './views/manufacture.react.js';
import DeploymentView from './views/deployment.react.js';
import DriverView from './views/driver.react.js';

import ViewStore from '../stores/view-store';
import DescriptionStore from '../stores/description-store';
import ClassStore from '../stores/class-store';

const logger = console;

export default class ClassDetail extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };

        // ex-componentWillMount hooks
        logger.info('will mount');

        // UI and stores handlers declaration
        //
        this.handleStoreUpdate = () => {
            // TODO: fixme
            this.forceUpdate();
        };
    }

    // lifecycle methods
    componentDidMount() {
        ViewStore.on('update', this.handleStoreUpdate.bind(this));
        DescriptionStore.on('update', this.handleStoreUpdate.bind(this));
    }
    componentWillUnmount() {
        ViewStore.removeListener('update', this.handleStoreUpdate.bind(this));
        DescriptionStore.removeListener('update', this.handleStoreUpdate.bind(this));
    }

    // common helpers
    setView(Component, payload = {}) {
        return (e) => {
            e.stopPropagation();
            ViewStore.setView(Component, payload);
        };
    }

    // render helpers
    renderMiniMap() {
        let sensors = DescriptionStore.getSensors();
        let actuators = DescriptionStore.getActuators();
        return (
            <div className="col-md-6">
                <div className="minimap-container">
                    <div onClick={this.setView(ManufactureView)}>
                        <h4>Device</h4>
                        <div className="children">
                            <div onClick={this.setView(SensorsView)}>
                                <h4>
                                    <span>Sensors</span>
                                    <button className="btn btn-primary btn-add" title="add" onClick={this.setView(SensorView, { id: null })}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </h4>
                                <div className="children">
                                    {
                                        sensors.map((m) => {
                                            return (
                                                <div key={m.id} onClick={this.setView(SensorView, { id: m.id })}>
                                                    <h4>
                                                        {m.type} #{m.id}
                                                    </h4>
                                                </div>
                                            );
                                        })
                                    }
                                    {
                                        sensors.length === 0 &&
                                            <span>No sensors added yet</span>
                                    }
                                </div>
                            </div>
                            <div onClick={this.setView(ActuatorsView)}>
                                <h4>
                                    <span>Actuators</span>
                                    <button className="btn btn-primary btn-add" title="add" onClick={this.setView(ActuatorView, { id: null })}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </h4>
                                <div className="children">
                                    {
                                        actuators.map((a) => {
                                            return (
                                                <div key={a.id} onClick={this.setView(ActuatorView, { id: a.id })}>
                                                    <h4>
                                                        {a.type} #{a.id}
                                                    </h4>
                                                </div>
                                            );
                                        })
                                    }
                                    {
                                        actuators.length === 0 &&
                                            <span>No actuators added yet</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderView() {
        let Component = ViewStore.getCurrentView() || ManufactureView;
        let payload = ViewStore.getCurrentPayload();
        return (
            <div className="col-md-6">
                <Component data={payload}></Component>
            </div>
        );
    }

    render() {
        return (
            <div className="col-md-10 container fluid">
                {this.renderMiniMap()}
                {this.renderView()}
            </div>
        );
    }
}