"use strict";

import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import saveAs from 'browser-filesaver';
import { Link } from 'react-router';
import FiledStore from '../../stores/field-store';

import SensorsView from './views/sensors.react.js';
import SensorView from './views/sensor.react.js';
import DescriptionView from './views/description.react.js';

import ViewManager from './view-manager';
import ModelDetailStore from '../../stores/model-detail-store';
import CurrentUserStore from '../../stores/current-user-store';

const logger = console;

export default class ModelDetail extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            isLoading: true
        };

        // ex-componentWillMount hooks
        logger.info('will mount');

        // UI and stores handlers declaration
        this.handleStoreUpdate = () => {
            // TODO: fixme
            this.forceUpdate();
        };
        this.handleSaveClick = () => {
            ModelDetailStore.save();
        };
        this.handleAddSensor = () => {
            ModelDetailStore.addSensor().done((uri) => {
                this.setView(SensorView, {
                    uri: uri
                });
            });
        };
        this.handleRemoveClick = () => {
            ModelDetailStore.remove();
        };

        ViewManager.setView(DescriptionView);
    }

    // lifecycle methods
    componentDidMount() {
        this.setState({
            isLoading: true
        }, () => {
            ModelDetailStore.init(this.props.params.uri === "new" ? null : this.props.params.uri).done(() => {
                this.setState({
                    isLoading: false
                });
            });
        });
        ViewManager.on('update', this.handleStoreUpdate);
        ModelDetailStore.on('update', this.handleStoreUpdate);
    }
    componentWillReceiveProps(nextProps) {
        //
    }
    componentWillUnmount() {
        ViewManager.removeListener('update', this.handleStoreUpdate);
        ModelDetailStore.removeListener('update', this.handleStoreUpdate);
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
        let device = ModelDetailStore.getDevice();
        let sensors = device.sensors;
        return (
            <div className="col-md-6">
                <div className="minimap-container">
                    <div onClick={this.setView(DescriptionView)}>
                        {
                            <span onClick={this.handleRemoveClick} className="fa fa-remove"></span>
                        }
                        <h4>
                            <span>{device.label}</span>
                            {
                                <button className="btn btn-primary" onClick={this.handleSaveClick}>
                                    <i className="fa fa-save"></i>
                                    <span>Save</span>
                                </button>
                            }
                        </h4>
                        <div className="children">
                            <div onClick={this.setView(SensorsView)}>
                                <h4>
                                    <span>Sensors</span>
                                    {
                                        <button className="btn btn-primary btn-add" title="add" onClick={this.handleAddSensor}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    }
                                </h4>
                                <div className="children">
                                    {
                                        sensors.map((s) => {
                                            return (
                                                <div key={s} onClick={this.setView(SensorView, { uri: s })}>
                                                    <h4>
                                                        {
                                                            _.find(FiledStore.getSensorTypes(), (t) => {
                                                                return device.getSensorObserves(s) === t.literal;
                                                            }).label
                                                        }
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
                <Component classURI={this.props.params.uri} data={payload}></Component>
            </div>
        );
    }

    render() {
        if (this.state.isLoading) {
            return <span>loading..</span>;
        }
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
                        <h3>Model View</h3>
                        <p>Describe generic device model</p>
                    </div>
                </div>
                <div className="app-container container fluid class-detail">
                    {this.renderMiniMap()}
                    {this.renderView()}
                </div>
            </div>
        );
    }
}