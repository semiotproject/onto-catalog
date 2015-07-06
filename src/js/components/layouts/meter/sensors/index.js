"use strict";

let React = require('react');

import { Link } from 'react-router';
import Store from '../../../../stores/description-store';

export default class SensorUnitsTab extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        let sensors = Store.getSensors();
        return (
            <div>
                <div>
                    <Link to={"Single sensor"} params={{ id: "new" }} >
                        <div className="col-md-4">
                            <button className="big">
                                +
                            </button>
                        </div>
                    </Link> 
                    {sensors && sensors.map((item, index) => {
                        return (
                            <Link to={"Single sensor"} key={index} params={{ id: index }} >
                                <div className="col-md-4">
                                    <button className="big">
                                        {item.type} # {index}
                                    </button>
                                </div>
                            </Link> 
                        );
                    })}
                </div>
            </div>
        );
    }
}
