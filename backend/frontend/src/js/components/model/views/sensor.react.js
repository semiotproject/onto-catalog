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
        this.handleAddPropClick = () => {
            Store.addSensorProperty(uri, this.refs['new-prop-type'].value);
        };
    }

    renderProps() {
        const device = Store.getDevice();
        const { uri } = this.props;

        console.log(device.getSensorMeasurementPreperties(uri));

        return device.getSensorMeasurementPreperties(uri).map((p) => {
            return <div key={p}>{p}</div>;
        });
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
                        <label htmlFor="">Feature of interest: </label>
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
                    <div className="form-group">
                        <button className="btn btn-primary" onClick={this.handleAddPropClick}>
                            <i className="fa fa-add"></i>
                            <span>Add property</span>
                        </button>
                        <select ref="new-prop-type">
                            {
                                Store.MEASUREMENT_PROPERTIES.map((p) => {
                                    return <option value={p} key={p}>{p}</option>;
                                })
                            }
                        </select>
                    </div>
                    {
                        this.renderProps()
                    }
                </div>
            </div>
        );
    }
}
