"use strict";

let React = require('react');

import Store from '../../stores/description-store';

export default class SensorView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    handleClick() {
        let sensor = {};
        sensor.id = this.props.data.id;
        sensor.type = this.refs.type.getDOMNode().value;
        sensor.endpoint = this.refs.endpoint.getDOMNode().value;
        sensor.protocol = this.refs.protocol.getDOMNode().value;

        sensor.id !== null ? Store.saveSensor(sensor) : Store.addSensor(sensor);
    }

    render() {
        let header = this.props.data.id === null ? "New sensor" : `Sensor #${this.props.data.id}`;
        let sensor = Store.getSensorById(this.props.data.id);
        return (
            <div>
                <header>{header}</header>
                <div className="form" key={this.props.data.id}>
                   <div className="form-group">
                        <label for="">Type</label>
                        <select ref="type" type="text" className="form-control" defaultValue={sensor && sensor.type}>
                            <option value="Humidity">Humidity</option>
                            <option value="Amperage">Amperage</option>
                            <option value="Heat">Heat</option>
                            <option value="Temperature">Temperature</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label for="">Units of Measurement</label>
                        <select ref="units" type="text" className="form-control" defaultValue={sensor && sensor.units}>
                            <option value="C">C</option>
                            <option value="F">F</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label for="">Operating range</label>
                        <div>
                            <span>
                                <label htmlFor="">From</label>
                                <input type="number" ref="range-from" className="form-control" defaultValue={sensor && sensor.range && sensor.range.from}/>
                            </span>
                            <span>
                                <label htmlFor="">To</label>
                                <input type="number" ref="range-to" className="form-control" defaultValue={sensor && sensor.range && sensor.range.to}/>
                            </span>
                        </div>
                    </div>
                    <div className="form-group">
                        <label for="">Accuracy</label>
                        <input type="text" ref="range-accuracy" className="form-control" defaultValue={sensor && sensor.accuracy}/>
                    </div>
                    <div className="form-group">
                        <label for="">Sensing period</label>
                        <input type="text" ref="range-period" className="form-control" defaultValue={sensor && sensor.period}/>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-lg btn-primary" onClick={this.handleClick.bind(this)}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
