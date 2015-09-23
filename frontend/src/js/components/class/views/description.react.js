"use strict";

let React = require('react');

import _ from 'lodash';
import Store from '../../../stores/class-store';

const FIELDS = {
    'uri': {
        title: "Class URI"
    },
    'rdfs:label.@value': {
        title: "label"
    }
};

export default class DescriptionView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };

        this.handleChange = () => {
            let model = Store.getCurrentClass();

            this.setFieldValue(model, 'uri');
            this.setFieldValue(model, 'rdfs:label.@value');

            console.log('now model is ', model);

            // Store.update(model);
        };
    }

    renderField(type, value) {
        let isEditable = Store.isEditable(this.props.classId);
        let val;
        if (isEditable) {
            val = (
                <input type="text"
                    key={this.props.classId + "-" + type}
                    onChange={this.handleChange}
                    ref={type}
                    className="form-control"
                    defaultValue={value}
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

    getManufacturer(model) {
        return '';
    }
    getlabel(model) {
        return (model && model['rdfs:label'] && model['rdfs:label']['@value']) || "";
    }

    setFieldValue(model, type) {
        let keys = type.split('.');

        let prev = model;
        for (var i = 0; i < keys.length - 1; i++) {
            prev = prev[keys[i]];
        }
        prev[keys[i]] = this.refs[type].getDOMNode().value;
    }

    render() {
        let model = Store.getByURI(this.props.classURI);

        return (
            <div>
                <header>Device</header>
                <div>
                    {this.renderField(
                        'uri',
                        model.uri
                    )}
                    {this.renderField(
                        'rdfs:label.@value',
                        (model && model['rdfs:label'] && model['rdfs:label']['@value']) || ""
                    )}
                </div>
            </div>
        );
    }
}
