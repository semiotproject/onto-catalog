"use strict";

let React = require('react');

import Store from '../../../stores/class-store';

export default class ActuatorsView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        let actuators = Store.getActuators();
        return (
            <div>
                <header>Actuators</header>
                <div>
                    <div className="col-md-4">
                        <button className="big">
                            +
                        </button>
                    </div>
                    {
                        actuators.map((item, index) => {
                            return (
                                <div className="col-md-4">
                                    <button className="big">
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
