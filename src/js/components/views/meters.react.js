"use strict";

let React = require('react');

import Store from '../../stores/description-store';

export default class MetersView extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        let meters = Store.getMeters();
        return (
            <div>
                <header>Meters</header>
                <div>
                    <div className="col-md-4">
                        <button className="big">
                            +
                        </button>
                    </div>
                    {
                        meters.map((item, index) => {
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
