"use strict";

let React = require('react');

import Store from '../../../stores/current-class-store';
import ViewManager from '../view-manager';

import SensorView from './sensor.react';

export default class SensorsView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
        this.handleAddSensor = () => {
            let newSensorURI = Store.addSensor();
            this.setView(SensorView, {
                uri: newSensorURI
            });
        };
        this.handleClick = (uri) => {
            return () => {
                ViewManager.setView(SensorView, { uri: uri });
            };
        };
    }

    render() {
        let model = Store.get();
        let sensors = model['ssn:hasSubSystem'];
        return (
            <div>
                <h3>Sensors</h3>
                <div>
                    <div className="col-md-4" key={-1}>
                        {
                            Store.isEditable() &&
                                <button className="big" onClick={this.handleAddSensor}>
                                    +
                                </button>
                        }
                    </div>
                    {
                        sensors.map((item, index) => {
                            return (
                                <div className="col-md-4" key={item.uri}>
                                    <button className="big" onClick={this.handleClick(item.uri)}>
                                        <div>{item["ssn:observes"]}</div>
                                    </button>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}
