"use strict";

let React = require('react');

import Store from '../../stores/description-store';

export default class SensorUnit extends React.Component {

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

        sensor.id !== null ? Store.saveMeter(sensor) : Store.addMeter(sensor);
    }

    render() {
        let header = this.props.data.id === null ? "New sensor" : `Sensor #${this.props.data.id}`;
        let sensor = Store.getMeterById(this.props.data.id);
        return (
            <div>
                <header>{header}</header>
                <div className="form">
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
                        <label for="">Communication Endpoint</label>
                        <input type="text" ref="endpoint" className="form-control" defaultValue={sensor && sensor.endpoint}/>
                    </div>
                    <div className="form-group">
                        <label for="">Protocol</label>
                        <select ref="protocol" type="text" className="form-control" defaultValue={sensor && sensor.protocol}>
                            <option value="CoAP">CoAP</option>
                            <option value="WAMP">WAMP</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <button className="btn btn-lg btn-primary" onClick={this.handleClick.bind(this)}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
