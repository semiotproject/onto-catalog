"use strict";

import React from 'react';
import $ from 'jquery';
import _ from 'lodash';
import { Link } from 'react-router';
import FieldStore from '../../stores/field-store';

import SensorsView from './views/sensors.react.js';
import SensorView from './views/sensor.react.js';
import DescriptionView from './views/description.react.js';

import ViewManager from './view-manager';
import ModelDetailStore from '../../stores/model-detail-store';
import CurrentUserStore from '../../stores/current-user-store';

import { constructURIFromUUID } from '../../utils';

const logger = console;

class ModelDetail extends React.Component {

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
            return this.isNew ? ModelDetailStore.save() : ModelDetailStore.update(this.getURI());
        };
        this.handleAddSensor = () => {
            const newSensorURI = ModelDetailStore.addSensor();
            this.setView(SensorView, {
                uri: newSensorURI
            });
        };
        this.handleRemoveClick = () => {
            ModelDetailStore.remove();
        };
        this.handleRemoveSensor = (uri) => {
            return (e) => {
                e.stopPropagation();
                ModelDetailStore.removeSensor(uri);
                ViewManager.setView(SensorsView);
                ModelDetailStore.triggerUpdate();
            };
        };

        ViewManager.setView(DescriptionView);
    }

    // lifecycle methods
    componentDidMount() {
        this.setState({
            isLoading: true
        }, () => {
            ModelDetailStore.init(this.isNew ? null : this.getURI()).done(() => {
                this.setState({
                    isLoading: false
                });
            });
        });
        ViewManager.on('update', this.handleStoreUpdate);
        ModelDetailStore.on('update', this.handleStoreUpdate);
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
        let model = ModelDetailStore.getModel();
        let sensors = model.sensors;
        return (
            <div className="col-md-6">
                <div className="minimap-container">
                    <div onClick={this.setView(DescriptionView)}>
                        {
                            !this.isNew &&
                                <span onClick={this.handleRemoveClick} className="fa fa-remove"></span>
                        }
                        <h4>
                            <span>{model.label}</span>
                            {
                                <button className="btn btn-primary" onClick={this.handleSaveClick}>
                                    <i className="fa fa-save"></i>
                                    <span>{this.isNew ? "Create" : "Update"}</span>
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
                                                <div key={s.uri} onClick={this.setView(SensorView, { uri: s.uri })}>
                                                    <h4>
                                                        {
                                                            _.find(FieldStore.getSensorTypes(), (t) => {
                                                                return s.featureOfInterest === t.literal;
                                                            }).label
                                                        }
                                                        <button className="btn btn-primary btn-add" onClick={this.handleRemoveSensor(s.uri)}>
                                                            <i className="fa fa-minus"></i>
                                                        </button>
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
                <Component classURI={this.getURI()} data={payload}></Component>
            </div>
        );
    }

    getURI() {
        console.log(this.props.params.uri, constructURIFromUUID(this.props.params.uri));
        return constructURIFromUUID(this.props.params.uri);
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

export class ModelDetailCreate extends ModelDetail {
    constructor(props) {
        console.log('initialising new model detail view');
        super(props);
        this.isNew = true;
    }
}

export class ModelDetailUpdate extends ModelDetail {
    constructor(props) {
        console.log('initialising existing model detail view');
        super(props);
        this.isNew = false;
    }
}