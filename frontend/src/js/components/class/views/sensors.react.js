"use strict";

let React = require('react');

import Store from '../../../stores/class-store';
import ViewManager from '../view-manager';

import SensorView from './sensor.react';

export default class SensorsView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
        this.handleAddSensor = () => {
            let newSensorId = Store.addSensor(this.props.classId);
            this.setView(SensorView, {
                id: newSensorId
            });
        };
        this.handleClick = (id) => {
            return () => {
                ViewManager.setView(SensorView, { id: id });
            };
        };
    }

    render() {
        let model = Store.getByURI(this.props.classURI);
        let sensors = model['ssn:hasSubSystem'];
        return (
            <div>
                <header>Sensors</header>
                <div>
                    <div className="col-md-4" key={-1}>
                        {
                            Store.isEditable(this.props.classId) &&
                                <button className="big" onClick={this.handleClick(null)}>
                                    +
                                </button>
                        }
                    </div>
                    {
                        sensors.map((item, index) => {
                            return (
                                <div className="col-md-4" key={item.id}>
                                    <button className="big" onClick={this.handleClick(item.uri)}>
                                        {item["ssn:observes"]}
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
