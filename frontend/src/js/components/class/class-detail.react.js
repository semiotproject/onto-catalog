"use strict";

import React from 'react';
import $ from 'jquery';
import saveAs from 'browser-filesaver';

import SensorsView from './views/sensors.react.js';
import SensorView from './views/sensor.react.js';
import DescriptionView from './views/description.react.js';

import ViewManager from './view-manager';
import CurrentClassStore from '../../stores/current-class-store';
import CurrentUserStore from '../../stores/current-user-store';

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
            CurrentClassStore.save(this.props.classId);
        };
        this.handleAddSensor = () => {
            let newSensorURI = CurrentClassStore.addSensor(this.props.classURI);
            this.setView(SensorView, {
                seneorURI: newSensorURI
            });
        };
        this.handleRemoveClick = () => {
            CurrentClassStore.remove(this.props.classId);
        };
    }

    // lifecycle methods
    componentDidMount() {
        ViewManager.on('update', this.handleStoreUpdate);
        CurrentClassStore.on('update', this.handleStoreUpdate);
    }
    componentWillUnmount() {
        ViewManager.removeListener('update', this.handleStoreUpdate);
        CurrentClassStore.removeListener('update', this.handleStoreUpdate);
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
        let model = CurrentClassStore.get();
        let sensors = model['ssn:hasSubSystem'];
        return (
            <div className="col-md-6">
                <div className="minimap-container">
                    <div onClick={this.setView(DescriptionView)}>
                        {
                            CurrentClassStore.isEditable() && !CurrentClassStore.isNew() &&
                            <span onClick={this.handleRemoveClick} className="fa fa-remove"></span>
                        }
                        <h4>
                            <span>{this.props.classURI ? ((model && model['rdfs:label'] && model['rdfs:label']['@value']) || "") : "New Device Class"}</span>
                            {
                                CurrentClassStore.isEditable() &&
                                    <button className="btn btn-primary" onClick={this.handleSaveClick}>
                                        <i className="fa fa-save"></i>
                                        <span>{!CurrentClassStore.isNew() ? "Save" : "Create"}</span>
                                    </button>
                            }
                        </h4>
                        <div className="children">
                            <div onClick={this.setView(SensorsView)}>
                                <h4>
                                    <span>Sensors</span>
                                    {
                                        CurrentClassStore.isEditable(this.props.classURI) &&
                                            <button className="btn btn-primary btn-add" title="add" onClick={this.handleAddSensor}>
                                                <i className="fa fa-plus"></i>
                                            </button>
                                    }
                                </h4>
                                <div className="children">
                                    {
                                        sensors.map((s) => {
                                            return (
                                                <div key={s.uri} onClick={this.setView(SensorView, { uri: s.uri })}>
                                                    <h4>
                                                        {s["ssn:observes"]}
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
                <Component classURI={this.props.classURI} data={payload}></Component>
            </div>
        );
    }

    render() {
        return (
            <div className="app-container container fluid class-detail">
                {this.renderMiniMap()}
                {this.renderView()}
            </div>
        );
    }
}