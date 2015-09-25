"use strict";

import React from 'react';

import ClassDetail from './class-detail.react';
import ClassList from './class-list.react';
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
        this.handleClassSelected = (uri) => {
            return () => {
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
        };
    }

    componentDidMount() {
        ClassListStore.load().done(() => {
            this.setState({
                isLoading: false
            });
        });
        // ClassListStore.on('update', this.handleStoreUpdate);
    }
    componentWillUnmount() {
        // ClassListStore.removeListener('update', this.handleStoreUpdate);
    }

    render() {
        let content;
        if (this.state.isLoading) {
            content = "Loading...";
        } else if (this.state.view === 'list') {
            content = <ClassList
                onItemClick={this.handleClassSelected}
            />;
        } else {
            content = <ClassDetail
                classURI={this.state.currentClass}
            />;
        }
        return (
            <div className="app-wrapper">
                <div className="app-header">
                    <h3>Class View</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum, provident omnis. Culpa officia magnam, ex ipsum est. Doloremque laborum, dolorem, earum architecto officia, minima esse iste quia dicta, saepe necessitatibus.</p>
                </div>
                {content}
            </div>
        );
    }
}