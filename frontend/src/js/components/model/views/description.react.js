import React from 'react';

import _ from 'lodash';
import CONFIG from '../../../config';
import Store from '../../../stores/model-detail-store';
import CurrentUserStore from '../../../stores/current-user-store';

export default class DescriptionView extends React.Component {

    constructor(props) {
        super(props);
        const model = Store.getModel();
        this.handleManufacturerChange = () => {
            model.manufacturer = this.refs['manufacturer'].value;
            Store.triggerUpdate();
        };
        this.handleLabelChange = () => {
            model.label = this.refs['label'].value;
            Store.triggerUpdate();
        };
    }

    render() {
        let { uri, label, manufacturer } = Store.getModel();
        const isDisabled = !CurrentUserStore.isEditable(Store.getModel());
        return (
            <div>
                <h3>Device</h3>
                <div>
                    <div className="form-group">
                        <label htmlFor="">URI</label>
                        <p>
                            <a className="form-control-static" href={uri}>{uri}</a>
                        </p>
                    </div>
                    <div className="form-group">
                        <label>Label</label>
                        <input className="form-control"
                            type="text"
                            ref="label"
                            defaultValue={label}
                            onChange={this.handleLabelChange}
                            disabled={isDisabled}/>
                    </div>
                    <div className="form-group">
                        <label>Manufacturer</label>
                        <input className="form-control"
                            type="text"
                            ref="manufacturer"
                            defaultValue={manufacturer}
                            onChange={this.handleManufacturerChange.bind(this, "manufacturer")}
                            disabled={isDisabled}/>
                    </div>
                </div>
            </div>
        );
    }
}
