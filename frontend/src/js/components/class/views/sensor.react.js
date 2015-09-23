"use strict";

let React = require('react');

import Store from '../../../stores/class-store';
import FieldStore from '../../../stores/field-store';
import _ from 'lodash';

const SENSOR_FIELDS = {
    type: {
        title: 'Type',
        path: 'ssn:observes',
        isSelect: true,
        options: FieldStore.getSensorTypes.map((t) => {
            return {
                value: t,
                title: t
            };
        })
    }
    /* ,
    accuracy: {
        title: 'Accuracy',
        isDisabled: true
    },
    sensingPeriod: {
        title: 'Sensing Period',
        isDisabled: true
    }
    */
};

const PROPERTY_FIELDS = {
    units: {
        title: 'Units of Measurement',
        isSelect: true,
        isDisabled: true,
        options: FieldStore.getUnitsOfMeasurement.map((t) => {
            return {
                value: t,
                title: t
            };
        })
    }
};

let measurementProperties = FieldStore.getMeasurementProperties();
for (let i = 0; i < measurementProperties.length; i++) {
    PROPERTY_FIELDS[measurementProperties[i]] = {
        title: measurementProperties[i],
        path: 'ssn:hasValue.DUL:hasDataValue.xsd:double'
    };
}

export default class SensorView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };

        this.handleChange = () => {
            let model = Store.getById(this.props.classId);
            let sensor = _.find(model.sensors, (s) => {
                return s.id === this.props.data.id;
            });

            sensor = _.assign({}, sensor, {
                type: this.refs.type.getDOMNode().value
            });

            Store.updateSensor(this.props.classId, sensor);
        };
    }

    renderField(type, value) {
        let isEditable = Store.isEditable(this.props.classId);
        let val;
        if (isEditable) {
            if (SENSOR_FIELDS[type].isSelect) {
                val = (
                    <select ref={type}
                        className="form-control"
                        onChange={this.handleChange}
                        key={this.props.classId + "-" + type}
                        disabled={SENSOR_FIELDS[type].isDisabled}
                        value={value}>
                        {
                            SENSOR_FIELDS[type].options.map((o) => {
                                return <option value={o.value}>{o.title}</option>;
                            })
                        }
                    </select>
                );
            } else {
                val = (
                    <input type="text"
                        key={this.props.classId + "-" + type}
                        onChange={this.handleChange}
                        ref={type}
                        className="form-control"
                        disabled={SENSOR_FIELDS[type].isDisabled}
                        value={value}
                    />
                );
            }
        } else {
            val = <span htmlFor="">{value}</span>;
        }
        return (
            <div className="form-group">
                <label for="">{SENSOR_FIELDS[type].title}:</label>
                {val}
            </div>
        );
    }

    render() {
        let sensor = Store.getSensorById(this.props.classId, this.props.data.id);
        let SENSOR_FIELDS;
        for (let key in SENSOR_FIELDS) {
            SENSOR_FIELDS.push(
                 this.renderField(SENSOR_FIELDS[key], sensor)
            );
        }
        return (
            <div>
                <header>{`Sensor #${this.props.data.id}`}</header>
                <div className="form" key={this.props.data.id}>
                    {SENSOR_FIELDS}
                </div>
            </div>
        );
    }
}
