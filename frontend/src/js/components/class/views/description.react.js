"use strict";

let React = require('react');

import _ from 'lodash';
import Store from '../../../stores/current-class-store';

const FIELDS = {
    'uri': {
        title: "Class URI",
        prefix: "http://semdesc.semiot.ru/model/"
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
            let model = Store.get();

            this.setFieldValue(model, 'uri');
            this.setFieldValue(model, 'rdfs:label.@value');

            Store.update(model);
        };
    }

    renderField(type, value, prefix = "") {
        let isEditable = Store.isEditable(this.props.classURI);
        let val;
        if (isEditable) {
            val = (
                <div>
                    {FIELDS[type].prefix}
                    <input type="text"
                        onChange={this.handleChange}
                        ref={type}
                        className="form-control"
                        defaultValue={value}
                    />
                </div>
            );
        } else {
            val = <span htmlFor="">{(FIELDS[type].prefix ? FIELDS[type].prefix : "") + value}</span>;
        }
        return (
            <div className="form-group" key={this.props.classId + "-" + type}>
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
        let model = Store.get();

        return (
            <div>
                <h3>Device</h3>
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
