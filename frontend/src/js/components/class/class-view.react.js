"use strict";

import React from 'react';

import ClassDetail from './class-detail.react';
import ClassList from './class-list.react';
import InstanceView from '../instance/instance-view.react';
import ClassListStore from '../../stores/class-list-store';
import CurrentClassStore from '../../stores/current-class-store';
import CurrentUserStore from '../../stores/current-user-store';

export default class ClassView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            view: 'list',
            isLoading: true,
            currentClass: null
        };
        this.handleStoreUpdate = () => {
            this.forceUpdate();
        };
        this.handleBackClick = () => {
            this.loadClassList();
        };
        this.handleCreateInstanceClick = (uri) => {
            console.log('Showing instance form for class with uri = ', uri);
            this.setState({
                view: 'instance',
                currentClass: uri
            });
        };
        this.handleClassSelected = (uri) => {
            if (uri === null) {
                console.log('creating new class...');
                this.setState({
                    view: 'detail',
                    currentClass: CurrentClassStore.create()
                });
            } else {
                console.log('selected class with URI = ', uri);
                this.setState({
                    isLoading: true
                }, () => {
                    CurrentClassStore.load(uri).done(() => {
                        this.setState({
                            isLoading: false,
                            view: 'detail',
                            currentClass: uri
                        });
                    });
                });
            }
        };
    }

    loadClassList() {
        this.setState({
            isLoading: true
        }, () => {
            ClassListStore.load().done(() => {
                this.setState({
                    isLoading: false,
                    view: "list"
                });
            });
        });
    }

    componentDidMount() {
        this.loadClassList();
        // ClassListStore.on('update', this.handleStoreUpdate);
    }
    componentWillUnmount() {
        // ClassListStore.removeListener('update', this.handleStoreUpdate);
    }

    render() {
        let content, title;

        let classHeader = (
            <div>
                <h3>Model View</h3>
                <p>Describe generic device model</p>
            </div>
        );
        let instanceHeader = (
            <div>
                <h3>Instance View</h3>
                <p>Create new device instance based on selected class</p>
            </div>
        );
        if (this.state.isLoading) {
            content = "Loading...";
        } else if (this.state.view === 'list') {
            content = <ClassList
                onItemClick={this.handleClassSelected}
                onCreateInstanceClick={this.handleCreateInstanceClick}
            />;
            title = classHeader;
        } else if (this.state.view === 'detail') {
            content = <ClassDetail
                classURI={this.state.currentClass}
            />;
            title = classHeader;
        } else if (this.state.view === 'instance') {
            content = <InstanceView classURI={this.state.currentClass} />;
            title = instanceHeader;
        }
        return (
            <div className="app-wrapper">
                <div className="app-header">
                    {
                        this.state.view !== "list" &&
                        <button className="btn btn-primary" style={{
                            position: "absolute",
                            left: "20px",
                            top: "30px"
                        }} onClick={this.handleBackClick}><i className="fa fa-arrow-circle-left"></i> Back</button>
                    }
                    {title}
                </div>
                {content}
            </div>
        );
    }
}