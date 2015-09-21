"use strict";

import React from 'react';

import ClassStore from '../../stores/class-store';
import CurrentUserStore from '../../stores/current-user-store';

export default class ClassView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <div className="app-container container-fluid class-list">
                <div className="col-md-2" key={-1}>
                    <button className="big" onClick={this.props.onItemClick(null)}>
                        +
                    </button>
                </div>
                {
                    ClassStore.get().map((c) => {
                        return (
                            <div className="col-md-2" key={c.uri}>
                                <button className="big" onClick={this.props.onItemClick(c.uri)}>
                                    {c.label} by {c.author.username}
                                </button>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}