"use strict";

import React from 'react';
import { Link } from 'react-router';

import ModelListStore from '../../stores/model-list-store';
import CurrentUserStore from '../../stores/current-user-store';

import { parseUUIDFromURI } from '../../utils';

export default class ModelList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true
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
    componentDidMount() {
        this.setState({
            isLoading: true
        }, () => {
            ModelListStore.load().done(() => {
                this.setState({
                    isLoading: false
                });
            });
        });
    }

    render() {
        if (this.state.isLoading) {
            return <span>loading..</span>;
        }
        return (
            <div className="app-wrapper">
                <div className="app-header">
                    <div>
                        <h3>Model List</h3>
                        <p>Repository of generic device models</p>
                    </div>
                </div>
                <div className="app-container container-fluid model-list" style={{
                    margin: "0 auto",
                    maxWidth: "1160px"
                }}>
                    {
                        CurrentUserStore.isLoggedIn() &&
                            <div key={-1}>
                                <Link to={'/model/new'}>
                                    <div className="big indigo">
                                        <i className="fa fa-plus" style={{
                                            fontSize: "24px"
                                        }}></i>
                                    </div>
                                </Link>
                            </div>
                    }
                    {
                        ModelListStore.get().map((c) => {
                            return (
                                <div key={c.uri}>
                                        <div className="big">
                                            <div>
                                                <div style={{
                                                    fontSize: "16px"
                                                }}>
                                                    {c.label}
                                                </div>
                                                <div>
                                                    author: {c.author}
                                                </div>
                                                <div className="button-container">
                                                    <Link to={'/model/' + parseUUIDFromURI(c.uri)}>
                                                        {
                                                            CurrentUserStore.isEditable(c) ?
                                                                "Edit" :
                                                                "View"
                                                        }
                                                    </Link>
                                                    <Link to={'/instance/' + parseUUIDFromURI(c.uri)}>
                                                        Create instance
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}