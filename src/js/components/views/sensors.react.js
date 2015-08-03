"use strict";

let React = require('react');

import Store from '../../stores/description-store';
import ViewStore from '../../stores/view-store';

import SensorView from './sensor.react';

export default class SensorsView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    handleClick(id) {
        return () => {
            ViewStore.setView(SensorView, { id: id });
        }
    }

    render() {
        let sensors = Store.getSensors();
        return (
            <div>
                <header>Sensors</header>
                <div>
                    <div className="col-md-4" key={-1}>
                        <button className="big" onClick={this.handleClick(null)}>
                            +
                        </button>
                    </div>
                    {
                        sensors.map((item, index) => {
                            return (
                                <div className="col-md-4" key={item.id}>
                                    <button className="big" onClick={this.handleClick(item.id)}>
                                        {item.type} # {index}
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
