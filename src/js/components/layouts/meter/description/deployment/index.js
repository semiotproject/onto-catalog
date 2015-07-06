"use strict";

let React = require('react');

import { Link } from 'react-router';
import Store from '../../../../../stores/description-store';

export default class Tab extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }    

    handleClick() { 
        let meter = Store.getMeter();        
        
        meter.description.deployment = {
            outdoor: {
                latitude: this.refs.latitude.getDOMNode().value, 
                longitude: this.refs.longitude.getDOMNode().value
            },
            indoor: {    
                floor: this.refs.floor.getDOMNode().value
            }
        };
        Store.updateMeter(meter);
    }

    render() {
        let deployment = Store.getMeter().description.deployment;
        let outdoor = deployment.outdoor;
        let indoor = deployment.indoor;
        return (
            <div className="form">
                <h3>Outdoor location</h3>
                <div className="form-group">
                    <label for="">Latitude</label>
                    <input type="text" ref="latitude" className="form-control" defaultValue={outdoor.latitude}/>
                </div>
                <div className="form-group">
                    <label for="">Longitude</label>
                    <input type="text" ref="longitude" className="form-control" defaultValue={outdoor.longitude}/>
                </div>
                <h3>Indoor location</h3>
                <div className="form-group">
                    <label for="">Floor</label>
                    <input type="text" ref="floor" className="form-control" defaultValue={indoor.floor}/>
                </div>                
                <div className="form-group">
                    <Link to={"Sensor description"}>
                        <button className="btn btn-large" onClick={this.handleClick.bind(this)}>Save</button>
                    </Link>
                </div>
            </div>
        );
    }
}
