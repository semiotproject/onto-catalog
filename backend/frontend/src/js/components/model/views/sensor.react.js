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

        this.handleLabelChange = (e) => {
            const sensor = this.getCurrentSensor();
            sensor.label = e.value;
            Store.triggerUpdate();
        };
        this.handleFeatureOfInterestChange = (e) => {
            const sensor = this.getCurrentSensor();
            sensor.featureOfInterest = e.value;
            this.updateUnitsOfMeasurement();
        };
        this.handleSensorUnitChange = (e) => {
            const sensor = this.getCurrentSensor();
            sensor.unitsOfMeasurement = e.value;
            Store.triggerUpdate();
        };
        this.handleAddPropClick = () => {
            const sensor = this.getCurrentSensor();
            sensor.props.push({
                type: this.refs['new-prop-type'].value,
                value: 1.0
            });
            Store.triggerUpdate();
        };
        this.handlePropChanged = (type) => {
            const sensor = this.getCurrentSensor();
            return (e) => {
                sensor.props.forEach((p, index) => {
                    console.log(p.type, type, e);
                    if (p.type === type) {
                        sensor.props[index].value = e.target.value;
                    }
                });
                Store.triggerUpdate();
            };
        };
        this.handleRemovePropClick = (type) => {
            const sensor = this.getCurrentSensor();
            return () => {
                _.remove(sensor.props, (p) => {
                    return p.type === type;
                });
                Store.triggerUpdate();
            };
        };
    }
    componentDidMount() {
        this.updateUnitsOfMeasurement();
    }
    componentDidUpdate(prevProps) {
        if (this.props.data.uri !== prevProps.data.uri) {
            this.updateUnitsOfMeasurement();
        }
    }

    updateUnitsOfMeasurement() {
        const sensor = this.getCurrentSensor();
        const featureOfInterest = sensor.featureOfInterest;
        FieldStore.loadUnitsOfMeasurement(featureOfInterest).done(() => {
            // TODO: set default units on demand
            // sensor.unitsOfMeasurement = Store.getDefaultUnitsOfMeasurement();
            Store.triggerUpdate();
        });
    }

    renderProp(prop) {
        const targetProp = _.find(Store.MEASUREMENT_PROPERTIES, (mp) => {
            return prop.type === mp.type;
        });
        if (!targetProp) {
            return;
        }
        return (
            <div key={prop.type} className="form-group">
                <label htmlFor="">
                    <span>{targetProp.label}</span>
                    &nbsp;
                    <i className="fa fa-remove" onClick={this.handleRemovePropClick(prop.type)}></i>
                </label>
                <input type="text"
                    className="form-control"
                    ref="label"
                    onChange={this.handlePropChanged(prop.type)}
                    defaultValue={prop.value}
                />
            </div>
        );
    }

    getCurrentSensor() {
        const { uri } = this.props.data;
        const model = Store.getModel();
        return _.find(model.sensors, (s) => { return s.uri === uri; });
    }

    render() {
        const { uri } = this.props.data;
        const sensor = this.getCurrentSensor();
        const availableToAddProps = Store.MEASUREMENT_PROPERTIES.filter((p) => {
            return !_.find(sensor.props, (pp) => {
                return pp.type === p.type;
            });
        });
        return (
            <div>
                <h3>Sensor</h3>
                <div className="form" key={uri}>
                    <div key="label" className="form-group">
                        <label htmlFor="">Label: </label>
                        <input type="text"
                            className="form-control"
                            ref="label"
                            onChange={this.handleLabelChange.bind(this, 'label')}
                            defaultValue={sensor.label}
                        />
                    </div>
                    <div key="observes" className="form-group">
                        <label htmlFor="">Feature of interest: </label>
                        <Select
                            value={sensor.featureOfInterest}
                            clearable={false}
                            searchable={true}
                            ref="feature-of-interest"
                            options={
                                FieldStore.getSensorTypes().map((t) => {
                                    return {
                                        value: t.literal,
                                        label: t.label
                                    };
                                })
                            }
                            onChange={this.handleFeatureOfInterestChange}
                         />
                    </div>
                    {
                        FieldStore.getUnitsOfMeasurement().length > 0 &&
                            <div key="unit" className="form-group">
                                <label htmlFor="">Unit of measurement: </label>
                                <Select
                                    value={sensor.unitsOfMeasurement}
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
                    }
                    {
                        availableToAddProps.length > 0 &&
                            <div className="form-group">
                                <button className="btn btn-primary" onClick={this.handleAddPropClick}>
                                    <i className="fa fa-add"></i>
                                    <span>Add property</span>
                                </button>
                                <select ref="new-prop-type" className="form-control" style={{
                                    display: "inline-block",
                                    width: "300px",
                                    marginLeft: "11px"
                                }}>
                                    {
                                        availableToAddProps.map((p) => {
                                            return <option value={p.type} key={p.type}>{p.label}</option>;
                                        })
                                    }
                                </select>
                            </div>
                    }
                    {
                        sensor.props.map(this.renderProp.bind(this))
                    }
                </div>
            </div>
        );
    }
}
