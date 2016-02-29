"use strict";

import React, { Component } from 'react';
import Select from 'react-select';

import Store from '../../../stores/model-detail-store';
import FieldStore from '../../../stores/field-store';
import _ from 'lodash';

export default class SensorView extends React.Component {

    constructor(props) {
        super(props);

        const { uri } = props.data;

        this.handleChange = (type) => {
            let sensor = _.find(Store.getDevice().sensors, (s) => {
                return s.uri === uri;
            });
            sensor[type] = this.refs[type].value;
        };
        this.handleSensorTypeChange = (e) => {
            Store.getDevice().setSensorObserves(uri, e.value);
            FieldStore.loadUnitsOfMeasurement(e.value).done(() => {
                Store.triggerUpdate();
            });
        };
        this.handleSensorUnitChange = (e) => {
            Store.getDevice().setSensorUnit(uri, e.value);
            Store.triggerUpdate();
        };

        this.handleAccuracyChange = (e) => {
            Store.getDevice().setSensorAccuracy(uri, e.target.value);
            Store.triggerUpdate();
        };
        this.handleSensitivityChange = (e) => {
            Store.getDevice().setSensorSensitivity(uri, e.target.value);
            Store.triggerUpdate();
        };
        this.handleResolutionChange = (e) => {
            Store.getDevice().setSensorResolution(uri, e.target.value);
            Store.triggerUpdate();
        };
    }

    render() {
        const device = Store.getDevice();
        const { uri } = this.props;
        return (
            <div>
                <h3>Sensor</h3>
                <div className="form" key={uri}>
                    <div key="label" className="form-group">
                        <label htmlFor="">Label: </label>
                        <input type="text"
                            className="form-control"
                            ref="label"
                            onChange={this.handleChange.bind(this, 'label')}
                            defaultValue={device.getSensorLabel(uri)}
                        />
                    </div>
                    <div key="observes" className="form-group">
                        <label htmlFor="">Sensor type: </label>
                        <Select
                            value={device.getSensorObserves(uri)}
                            clearable={false}
                            searchable={true}
                            options={
                                FieldStore.getSensorTypes().map((t) => {
                                    return {
                                        value: t.literal,
                                        label: t.label
                                    };
                                })
                            }
                            onChange={this.handleSensorTypeChange}
                         />
                    </div>
                    <div key="unit" className="form-group">
                        <label htmlFor="">Unit of measurement: </label>
                        <Select
                            value={device.getSensorUnit(uri)}
                            clearable={false}
                            searchable={true}
                            options={
                                FieldStore.getUnitsOfMeasurement().map((t) => {
                                    return {
                                        value: t.literal,
                                        label: t.label
                                    };
                                })
                            }
                            onChange={this.handleSensorUnitChange}
                         />
                    </div>
                    <div key="accuracy" className="form-group">
                        <label htmlFor="">Accuracy: </label>
                        <input type="number"
                            className="form-control"
                            ref="accuracy"
                            onChange={this.handleAccuracyChange}
                            defaultValue={device.getSensorAccuracy(uri)}
                        />
                    </div>
                    <div key="sensitivity" className="form-group">
                        <label htmlFor="">Sensitivity: </label>
                        <input type="number"
                            className="form-control"
                            ref="sensitivity"
                            onChange={this.handleSensitivityChange}
                            defaultValue={device.getSensorSensitivity(uri)}
                        />
                    </div>
                    <div key="resolution" className="form-group">
                        <label htmlFor="">Resolution: </label>
                        <input type="number"
                            className="form-control"
                            ref="resolution"
                            onChange={this.handleResolutionChange}
                            defaultValue={device.getSensorResolution(uri)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
