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
        let manufacture = meter.description.manufacture;

        manufacture.uri = this.refs.uri.getDOMNode().value;
        manufacture.manufacturer = this.refs.manufacturer.getDOMNode().value;
        manufacture.model = this.refs.model.getDOMNode().value;
        manufacture.version = this.refs.version.getDOMNode().value;

        Store.updateMeter(meter);
    }

    render() {
        let manufacture = Store.getMeter().description.manufacture;
        return (
            <div>
                <div className="form-group">
                    <label for="">URI</label>
                    <input type="text" ref="uri" className="form-control" defaultValue={manufacture.uri}/>
                </div>
                <div className="form-group">
                    <label for="">Manufacturer</label>
                    <input type="text" ref="manufacturer" className="form-control" defaultValue={manufacture.manufacturer}/>
                </div>
                <div className="form-group">
                    <label for="">Model</label>
                    <input type="text" ref="model" className="form-control" defaultValue={manufacture.model}/>
                </div>
                <div className="form-group">
                    <label for="">Version</label>
                    <input type="text" ref="version" className="form-control" defaultValue={manufacture.version}/>
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
