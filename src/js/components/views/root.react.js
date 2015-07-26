"use strict";

let React = require('react');

import DescriptionView from './description.react';
import MetersView from './meters.react';
import ActuatorsView from './actuators.react';

import ViewStore from '../../stores/view-store';

export default class RootView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }


    // UI and stores handlers
    handleClick(Component) {
        return () => {
            ViewStore.setView(Component);
        }
    }

    // common helpers


    // render helpers


    render() {
        return (
            <div>
                <header>Device</header>
                <div className="row">
                    <div className="col-md-4">
                        <button className="big" onClick={this.handleClick(DescriptionView)}>
                            Description
                        </button>
                    </div>
                    <div className="col-md-4">
                        <button className="big" onClick={this.handleClick(MetersView)}>
                            Meters
                        </button>
                    </div>
                    <div className="col-md-4">
                        <button className="big inactive" onClick={this.handleClick(ActuatorsView)}>
                            Actuators
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
