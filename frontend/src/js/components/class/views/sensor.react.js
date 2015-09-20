"use strict";

let React = require('react');

import Store from '../../../stores/class-store';
import _ from 'lodash';

const FIELDS = {
    label: {
        title: 'Label'
    },
    type: {
        title: 'Type',
        isSelect: true,
        options: [
            {
                value: "emtr:Amperage",
                title: "Amperage"
            },
            {
                value: "hmtr:Heat",
                title: "Heat"
            },
            {
                value: "hmtr:Temperature",
                title: "Temperature"
            }
        ]
    },
    units: {
        title: 'Units of Measurement',
        isSelect: true,
        isDisabled: true,
        options: [
            // here are options
        ]
    },
    accuracy: {
        title: 'Accuracy',
        isDisabled: true
    },
    sensingPeriod: {
        title: 'Sensing Period',
        isDisabled: true
    }
};

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
            if (FIELDS[type].isSelect) {
                val = (
                    <select ref={type}
                        className="form-control"
                        onChange={this.handleChange}
                        key={this.props.classId + "-" + type}
                        disabled={FIELDS[type].isDisabled}
                        value={value}>
                        {
                            FIELDS[type].options.map((o) => {
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
                        disabled={FIELDS[type].isDisabled}
                        value={value}
                    />
                );
            }
        } else {
            val = <span htmlFor="">{value}</span>;
        }
        return (
            <div className="form-group">
                <label for="">{FIELDS[type].title}:</label>
                {val}
            </div>
        );
    }

    render() {
        let sensor = Store.getSensorById(this.props.classId, this.props.data.id);
        return (
            <div>
                <header>{`Sensor #${this.props.data.id}`}</header>
                <div className="form" key={this.props.data.id}>
                    {this.renderField('label', sensor && sensor.label)}
                    {this.renderField('type', sensor && sensor.type)}
                    {this.renderField('units', sensor && sensor.units)}
                    {this.renderField('accuracy', sensor && sensor.accuracy)}
                    {this.renderField('sensingPeriod', sensor && sensor.sensingPeriod)}
                </div>
            </div>
        );
    }
}
