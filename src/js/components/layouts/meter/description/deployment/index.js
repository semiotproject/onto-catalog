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
                latitude: this.refs.out_latitude.getDOMNode().value, 
                longitude: this.refs.out_longitude.getDOMNode().value
            },
            indoor: {    
                floor: this.refs.floor.getDOMNode().value,                
                latitude: this.refs.in_latitude.getDOMNode().value, 
                longitude: this.refs.in_longitude.getDOMNode().value
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
                    <input type="text" ref="out_latitude" className="form-control" defaultValue={outdoor.latitude}/>
                </div>
                <div className="form-group">
                    <label for="">Longitude</label>
                    <input type="text" ref="out_longitude" className="form-control" defaultValue={outdoor.longitude}/>
                </div>
                <h3>Indoor location</h3>
                <div className="form-group">
                    <label for="">Floor</label>
                    <input type="text" ref="floor" className="form-control" defaultValue={indoor.floor}/>
                </div>
                <div className="form-group">
                    <label for="">Local latitude</label>
                    <input type="text" ref="in_latitude" className="form-control" defaultValue={indoor.latitude}/>
                </div>
                <div className="form-group">
                    <label for="">Local longitude</label>
                    <input type="text" ref="in_longitude" className="form-control" defaultValue={indoor.longitude}/>
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
