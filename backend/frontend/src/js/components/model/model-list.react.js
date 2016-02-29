"use strict";

import React from 'react';
import { Link } from 'react-router';

import ModelListStore from '../../stores/model-list-store';
import CurrentUserStore from '../../stores/current-user-store';

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
                        <h3>Model View</h3>
                        <p>Describe generic device model</p>
                    </div>
                </div>
                <div className="app-container container-fluid class-list">
                    {
                        CurrentUserStore.isLoggedIn() &&
                            <div className="col-md-2" key={-1}>
                                <Link to={'/model/new'}>
                                    <button className="big indigo">
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </Link>
                            </div>
                    }
                    {
                        ModelListStore.get().map((c) => {
                            return (
                                <div className="col-md-2" key={c.uri}>
                                        <button className="big">
                                            <div style={{
                                                fontSize: "16px"
                                            }}>
                                                {c.label}
                                            </div>
                                            <div>
                                                author: {c.author}
                                            </div>
                                            <div className="button-container">
                                                <Link to={'/model/' + encodeURIComponent(c.uri)}>
                                                    Edit
                                                </Link>
                                                <Link to={'/instance/' + encodeURIComponent(c.uri)}>
                                                    Create instance
                                                </Link>
                                            </div>
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