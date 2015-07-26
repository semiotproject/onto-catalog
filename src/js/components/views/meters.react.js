"use strict";

let React = require('react');

import Store from '../../stores/description-store';
import ViewStore from '../../stores/view-store';

import MeterView from './meter.react';

export default class MetersView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    handleClick(id) {
        return () => {
            ViewStore.setView(MeterView, { id: id });
        }
    }

    render() {
        let meters = Store.getMeters();
        return (
            <div>
                <header>Meters</header>
                <div>
                    <div className="col-md-4" key={-1}>
                        <button className="big" onClick={this.handleClick(null)}>
                            +
                        </button>
                    </div>
                    {
                        meters.map((item, index) => {
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
