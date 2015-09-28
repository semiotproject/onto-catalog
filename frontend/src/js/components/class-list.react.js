"use strict";

import React from 'react';
import { Link } from 'react-router';

import ClassListStore from '../stores/class-list-store';
import CurrentUserStore from '../stores/current-user-store';

export default class ClassView extends React.Component {
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
            ClassListStore.load().done(() => {
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
                                    <button className="big" style={{
                                        backgroundColor: "rgb(111, 219, 244)"
                                    }}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </Link>
                            </div>
                    }
                    {
                        ClassListStore.get().map((c) => {
                            return (
                                <div className="col-md-2" key={c.uri}>
                                    <Link to={'/model/' + encodeURIComponent(c.uri)}>
                                        <button className="big">
                                            <div style={{
                                                fontSize: "16px"
                                            }}>
                                                {c.label}
                                            </div>
                                            <div>
                                                author: {c.author}
                                            </div>
                                            <div>
                                                <Link to={'/instance/' + encodeURIComponent(c.uri)}>Create instance</Link>
                                            </div>
                                        </button>
                                    </Link>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}