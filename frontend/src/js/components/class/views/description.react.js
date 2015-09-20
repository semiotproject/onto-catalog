"use strict";

let React = require('react');

import _ from 'lodash';
import Store from '../../../stores/class-store';

export default class DescriptionView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };

        this.handleKeyUp = () => {
            let model = Store.getById(this.props.classId);

            model = _.assign({}, model, {
                uri: this.refs.uri.getDOMNode().value,
                label: this.refs.label.getDOMNode().value,
                manufacturer: this.refs.manufacturer.getDOMNode().value,
                version: this.refs.version.getDOMNode().value
            });

            Store.update(model);
        };
    }


    render() {
        let model = Store.getById(this.props.classId);

        return (
            <div>
                <header>Device</header>
                <div>
                    <div className="form-group">
                        <label for="">Class URI</label>
                        <input key={this.props.classId + "-uri"}
                            onChange={this.handleKeyUp}
                            type="text"
                            ref="uri"
                            className="form-control"
                            value={model.uri}/>
                    </div>
                    <div className="form-group">
                        <label for="">Label</label>
                        <input key={this.props.classId + "-label"}
                            onChange={this.handleKeyUp}
                            type="text"
                            ref="label"
                            className="form-control"
                            value={model.label}/>
                    </div>
                    <div className="form-group">
                        <label for="">Manufacturer</label>
                        <input key={this.props.classId + "-manufacturer"}
                            onChange={this.handleKeyUp}
                            type="text"
                            ref="manufacturer"
                            className="form-control"
                            value={model.manufacturer}/>
                    </div>
                    <div className="form-group">
                        <label for="">Version</label>
                        <input key={this.props.classId + "-version"}
                            onChange={this.handleKeyUp}
                            type="text"
                            ref="version"
                            className="form-control"
                            value={model.version}/>
                    </div>
                </div>
            </div>
        );
    }
}
