"use strict";

let React = require('react');

import Store from '../../stores/description-store';

export default class ManufactureView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    handleClick() {
        let manufacture = Store.getManufacture();

        manufacture.uri = this.refs.uri.getDOMNode().value;
        manufacture.label = this.refs.label.getDOMNode().value;
        manufacture.manufacturer = this.refs.manufacturer.getDOMNode().value;
        manufacture.model = this.refs.model.getDOMNode().value;
        manufacture.version = this.refs.version.getDOMNode().value;

        Store.setManufacture(manufacture);
    }

    render() {
        let manufacture = Store.getManufacture();
        return (
            <div>
                <header>Manufacture</header>
                <div>
                    <div className="form-group">
                        <label for="">URI</label>
                        <input type="text" ref="uri" className="form-control" defaultValue={manufacture.uri}/>
                    </div>
                    <div className="form-group">
                        <label for="">Label</label>
                        <input type="text" ref="label" className="form-control" defaultValue={manufacture.label}/>
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
                        <button className="btn btn-lg btn-primary" onClick={this.handleClick.bind(this)}>Save</button>
                    </div>
                </div>
            </div>
        );
    }
}
