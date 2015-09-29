"use strict";

let React = require('react');

import _ from 'lodash';
import CONFIG from '../../../config';
import Store from '../../../stores/current-class-store';

const FIELDS = {
    'rdfs:label.@value': {
        title: "label"
    },
    'mmi:hasManufacture.rdfs:label.@value': {
        title: "manifacture"
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
            this.setFieldValue(model, 'mmi:hasManufacture.rdfs:label.@value');

            Store.update(model);
        };
    }

    renderField(type, value, prefix = "") {
        let isEditable = Store.isEditable();
        let val;
        if (isEditable) {
            val = (
                <div>
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
                    <div className="form-group">
                        <label htmlFor="">Model URI</label>
                        {
                            this.props.classURI === "new" ?
                                <div>
                                    {CONFIG.BASE_CLASS_URI}
                                    <input type="text"
                                        onChange={this.handleChange}
                                        ref="uri"
                                        className="form-control"
                                        defaultValue={model.uri}
                                    />
                                </div> :
                                <span>{CONFIG.BASE_CLASS_URI + encodeURIComponent(model.uri)}</span>
                        }
                    </div>
                    {this.renderField(
                        'rdfs:label.@value',
                        (model && model['rdfs:label'] && model['rdfs:label']['@value']) || ""
                    )}
                    {this.renderField(
                        'mmi:hasManufacture.rdfs:label.@value',
                        (model && model['mmi:hasManufacture'] && model['mmi:hasManufacture']['rdfs:label'] && model['mmi:hasManufacture']['rdfs:label']['@value']) || ""
                    )}
                </div>
            </div>
        );
    }
}
