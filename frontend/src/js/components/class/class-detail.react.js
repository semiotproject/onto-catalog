"use strict";

import React from 'react';
import $ from 'jquery';
import saveAs from 'browser-filesaver';

import SensorsView from './views/sensors.react.js';
import SensorView from './views/sensor.react.js';
import ActuatorsView from './views/actuators.react.js';
import ActuatorView from './views/actuator.react.js';
import DescriptionView from './views/description.react.js';

import ViewManager from './view-manager';
import ClassStore from '../../stores/class-store';

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
        this.handleStoreUpdate = () => {
            // TODO: fixme
            this.forceUpdate();
        };
        this.handleSaveClick = () => {
            console.log('save was clicked');
            ClassStore.save(this.props.classId);
        };
        this.handleAddSensor = () => {
            let newSensorId = ClassStore.addSensor(this.props.classId);
            this.setView(SensorView, {
                id: newSensorId
            });
        };
        this.handleRemoveClick = () => {
            ClassStore.remove(this.props.classId);
        };
    }

    // lifecycle methods
    componentDidMount() {
        ViewManager.on('update', this.handleStoreUpdate.bind(this));
        ClassStore.on('update', this.handleStoreUpdate.bind(this));
    }
    componentDidUpdate(prevProps) {
        if (this.props.classId !== prevProps.classId) {
            ViewManager.setView(DescriptionView);
        }
    }
    componentWillUnmount() {
        ViewManager.removeListener('update', this.handleStoreUpdate.bind(this));
        ClassStore.removeListener('update', this.handleStoreUpdate.bind(this));
    }

    // common helpers
    setView(Component, payload = {}) {
        return (e) => {
            e.stopPropagation();
            ViewManager.setView(Component, payload);
        };
    }

    // render helpers
    renderMiniMap() {
        let model = ClassStore.getById(this.props.classId);
        let { sensors, actuators } = model;
        return (
            <div className="col-md-6">
                <div className="minimap-container">
                    <div onClick={this.setView(DescriptionView)}>
                        {
                            !model.isNew &&
                            <span onClick={this.handleRemoveClick} className="fa fa-remove"></span>
                        }
                        <h4>
                            <span>{model.isNew ? "New Device Class" : model.uri}</span>
                            <button className="btn btn-primary" onClick={this.handleSaveClick}>
                                <i className="fa fa-save"></i>
                                <span>{model.isNew ? "Create" : "Save"}</span>
                            </button>
                        </h4>
                        <div className="children">
                            <div onClick={this.setView(SensorsView)}>
                                <h4>
                                    <span>Sensors</span>
                                    <button className="btn btn-primary btn-add" title="add" onClick={this.handleAddSensor}>
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
        let Component = ViewManager.getCurrentView() || DescriptionView;
        let payload = ViewManager.getCurrentPayload();
        return (
            <div className="col-md-6">
                <Component data={payload} classId={this.props.classId}></Component>
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