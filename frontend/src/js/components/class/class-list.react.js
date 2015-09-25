"use strict";

import React from 'react';

import ClassListStore from '../../stores/class-list-store';
import CurrentUserStore from '../../stores/current-user-store';

export default class ClassView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
        this.handleCreateInstanceClick = (uri) => {
            return (e) => {
                e.stopPropagation();
                this.props.onCreateInstanceClick(uri);
            };
        };
        this.handleItemClick = (uri) => {
            return (e) => {
                this.props.onItemClick(uri);
            };
        };
    }

    render() {
        return (
            <div className="app-container container-fluid class-list">
                <div className="col-md-2" key={-1}>
                    <button className="big indigo" onClick={this.handleItemClick(null)}>
                        <i className="fa fa-plus"></i>
                    </button>
                </div>
                {
                    ClassListStore.get().map((c) => {
                        return (
                            <div className="col-md-2" key={c.uri}>
                                <button className="big" onClick={this.handleItemClick(c.uri)}>
                                    <div style={{
                                        fontSize: "16px"
                                    }}>
                                        {c.label}
                                    </div>
                                    <div>
                                        author: {c.author.username}
                                    </div>
                                    <div><a onClick={this.handleCreateInstanceClick(c.uri)}>Create instance</a></div>
                                </button>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}