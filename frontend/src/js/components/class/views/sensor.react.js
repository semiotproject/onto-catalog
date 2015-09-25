"use strict";

let React = require('react');

import Store from '../../../stores/current-class-store';
import FieldStore from '../../../stores/field-store';
import _ from 'lodash';

export default class SensorView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };

        this.handleChange = () => {
            let sensor = Store.getSensorByURI(this.props.data.uri);

            sensor["ssn:observes"] = this.refs['type'].getDOMNode().value;

            // sensitivity
            let sensitivity = this.getSensitivity(sensor);
            sensitivity["ssn:hasValue"]["DUL:hasDataValue"]["xsd1:double"] = this.refs['sensitivityValue'].getDOMNode().value;
            sensitivity["ssn:hasValue"]["DUL:isClassifiedBy"] = this.refs['sensitivityUnit'].getDOMNode().value;

            Store.updateSensor(sensor);
        };
    }

    getSensitivity(sensor) {
        return _.find(sensor['ssn:hasMeasurementCapability']['ssn:hasMeasurementProperty'], (i) => {
            return i['@type'] === "ssn:Sensitivity";
        });
    }
    renderSensitivity(sensor) {
        let s = this.getSensitivity(sensor);
        return (
            <div key="sensitivity">
                <label htmlFor="">Sensitivity</label>
                <div>
                    <input type="number"
                        onChange={this.handleChange}
                        className="form-control"
                        ref={"sensitivityValue"}
                        defaultValue={s["ssn:hasValue"]["DUL:hasDataValue"]["xsd1:double"]}
                    />
                    <select onChange={this.handleChange}
                        ref="sensitivityUnit"
                        className="form-control units"
                        defaultValue={s["ssn:hasValue"]["DUL:isClassifiedBy"]}
                    >
                        {
                            FieldStore.getUnitsOfMeasurement().map((t) => {
                                return <option value={t}>{t}</option>;
                            })
                        }
                    </select>
                </div>
            </div>
        );
    }

    renderType(sensor) {
        return (
            <div key="type">
                <label htmlFor="">Type</label>
                <select onChange={this.handleChange}
                    ref="type"
                    className="form-control"
                    defaultValue={sensor["ssn:observes"]}
                >
                    {
                        FieldStore.getSensorTypes().map((t) => {
                            return <option value={t}>{t}</option>;
                        })
                    }
                </select>
            </div>
        );
    }

    render() {
        let sensor = Store.getSensorByURI(this.props.data.uri);
        return (
            <div>
                <h3>Sensor</h3>
                <div className="form" key={this.props.data.uri}>
                    {this.renderType(sensor)}
                    {this.renderSensitivity(sensor)}
                </div>
            </div>
        );
    }
}
