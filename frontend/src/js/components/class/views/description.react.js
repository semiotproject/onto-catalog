"use strict";

let React = require('react');

import _ from 'lodash';
import Store from '../../../stores/class-store';

const FIELDS = {
    'uri': {
        title: "Class URI"
    },
    'label': {
        title: "Label"
    },
    'manufacturer': {
        title: "Manufacturer"
    },
    'version': {
        title: "Version"
    }
};

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

    renderField(type, value) {
        let isEditable = Store.isEditable(this.props.classId);
        let val;
        if (isEditable) {
            val = (
                <input type="text"
                    key={this.props.classId + "-" + type}
                    onChange={this.handleKeyUp}
                    ref={type}
                    className="form-control"
                    value={value}
                />
            );
        } else {
            val = <span htmlFor="">{value}</span>;
        }
        return (
            <div className="form-group">
                <label for="">{FIELDS[type].title}:</label>
                {val}
            </div>
        );
    }


    render() {
        let model = Store.getById(this.props.classId);

        return (
            <div>
                <header>Device</header>
                <div>
                    {this.renderField('uri', model.uri)}
                    {this.renderField('label', model.label)}
                    {this.renderField('manufacturer', model.manufacturer)}
                    {this.renderField('version', model.version)}
                </div>
            </div>
        );
    }
}
