"use strict";

let React = require('react');

import { Link } from 'react-router';
import Store from '../../../../../stores/description-store';

export default class SensorUnit extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    handleClick() {
        let sensor = {};
        sensor.id = this.props.params.id === "new" ? undefined : this.props.params.id;
        sensor.type = this.refs.type.getDOMNode().value;
        sensor.endpoint = this.refs.endpoint.getDOMNode().value;
        sensor.protocol = this.refs.protocol.getDOMNode().value;

        sensor.id ? Store.saveSensor(sensor) : Store.addSensor(sensor);
    }

    render() {
        let header = this.props.params.id === "new" ? "New sensor" : `Sensor #${this.props.params.id}`;
        let sensor = Store.getSensorById(this.props.params.id);
        return (
            <div>
                <div className="form">
                    <h4>{header}</h4>
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
                        <Link to={"Sensor units"}>
                            <button className="btn btn-large" onClick={this.handleClick.bind(this)}>Save</button>
                        </Link>
                    </div>
                </div>  
            </div>
        );
    }
}
