"use strict";

let React = require('react');

import _ from 'lodash';
import CONFIG from '../../../config';
import Store from '../../../stores/model-detail-store';

export default class DescriptionView extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = (type) => {
            const device = Store.getDevice();
            device[type] = this.refs[type].getDOMNode().value;
        };
        this.handleLabelChange = () => {
            Store.setDeviceLabel(this.refs['label'].getDOMNode().value);
        };
    }

    render() {
        let { uri, label, manufacturer } = Store.getDevice();
        return (
            <div>
                <h3>Device</h3>
                <div>
                    <div className="form-group">
                        <label htmlFor="">URI</label>
                        <p>
                            <a href={uri}>{uri}</a>
                        </p>
                    </div>
                    <div className="form-group">
                        <label>Label</label>
                        <input className="form-control"
                            type="text"
                            ref="label"
                            defaultValue={label}
                            onChange={this.handleLabelChange}/>
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input className="form-control"
                            type="text"
                            ref="manufacturer"
                            defaultValue={manufacturer}
                            onChange={this.handleChange.bind(this, "manufacturer")}/>
                    </div>
                </div>
            </div>
        );
    }
}
