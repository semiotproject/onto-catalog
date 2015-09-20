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
                            onKeyUp={this.handleKeyUp}
                            type="text"
                            ref="uri"
                            className="form-control"
                            defaultValue={model.uri}/>
                    </div>
                    <div className="form-group">
                        <label for="">Label</label>
                        <input key={this.props.classId + "-label"}
                            onKeyUp={this.handleKeyUp}
                            type="text"
                            ref="label"
                            className="form-control"
                            defaultValue={model.label}/>
                    </div>
                    <div className="form-group">
                        <label for="">Manufacturer</label>
                        <input key={this.props.classId + "-manufacturer"}
                            onKeyUp={this.handleKeyUp}
                            type="text"
                            ref="manufacturer"
                            className="form-control"
                            defaultValue={model.manufacturer}/>
                    </div>
                    <div className="form-group">
                        <label for="">Version</label>
                        <input key={this.props.classId + "-version"}
                            onKeyUp={this.handleKeyUp}
                            type="text"
                            ref="version"
                            className="form-control"
                            defaultValue={model.version}/>
                    </div>
                </div>
            </div>
        );
    }
}
