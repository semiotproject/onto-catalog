"use strict";

let React = require('react');

import Store from '../../../stores/model-detail-store';
import FieldStore from '../../../stores/field-store';
import _ from 'lodash';

export default class SensorView extends React.Component {

    constructor(props) {
        super(props);

        this.handleChange = (type) => {
            let sensor = _.find(Store.getDevice().sensors, (s) => {
                return s.uri === this.props.data.uri;
            });
            sensor[type] = this.refs[type].getDOMNode().value;
        };
        this.handleSensorTypeChange = () => {
            Store.setSensorType(this.props.data.uri, this.refs['observes'].getDOMNode().value);
        };
    }

    render() {
        let sensor = _.find(Store.getDevice().sensors, (s) => {
            return s.uri === this.props.data.uri;
        });
        return (
            <div>
                <h3>Sensor</h3>
                <div className="form" key={sensor.uri}>
                    <div key="observes" className="form-group">
                        <label htmlFor="">Sensor type: </label>
                        <select type="text"
                            className="form-control"
                            ref="observes"
                            onChange={this.handleSensorTypeChange}
                            defaultValue={sensor.observes}
                        >
                            {
                                FieldStore.getSensorTypes().map((t) => {
                                    return <option key={t.literal} value={t.literal}>{t.label}</option>;
                                })
                            }
                        </select>
                    </div>
                    <div key="label" className="form-group">
                        <label htmlFor="">Label: </label>
                        <input type="text"
                            className="form-control"
                            ref="label"
                            onChange={this.handleChange.bind(this, 'label')}
                            defaultValue={sensor.label}
                        />
                    </div>
                    <div key="accuracy" className="form-group">
                        <label htmlFor="">Accuracy: </label>
                        <input type="number"
                            className="form-control"
                            ref="accuracy"
                            onChange={this.handleChange.bind(this, 'accuracy')}
                            defaultValue={sensor.accuracy}
                        />
                    </div>
                    <div key="sensitivity" className="form-group">
                        <label htmlFor="">Sensitivity: </label>
                        <input type="number"
                            className="form-control"
                            ref="sensitivity"
                            onChange={this.handleChange.bind(this, 'sensitivity')}
                            defaultValue={sensor.sensitivity}
                        />
                    </div>
                    <div key="resolution" className="form-group">
                        <label htmlFor="">Resolution: </label>
                        <input type="number"
                            className="form-control"
                            ref="resolution"
                            onChange={this.handleChange.bind(this, 'resolution')}
                            defaultValue={sensor.resolution}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
