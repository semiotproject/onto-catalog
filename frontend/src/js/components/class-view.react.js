"use strict";

import React from 'react';

import ClassDetail from './class-detail.react';
import ClassStore from '../stores/class-store';

export default class ClassView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentClass: ClassStore.get().length > 0 ? ClassStore.get()[0].uri : null
        };

        this.handleAddClassClick = () => {
            console.log('class add click');
        };
        this.handleClassClick = (uri) => {
            return () => {
                console.log(`class with uri = ${uri} selected`);
                this.setState({
                    currentClass: uri
                });
            };
        };
    }

    render() {
        let classList = (
            ClassStore.get().map((c) => {
                return (
                    <li className={c.uri === this.state.currentClass ? "active" : ""}
                        onClick={this.handleClassClick(c.uri)}
                    >{c.uri}</li>
                );
            })
        );
        if (classList.length === 0) {
            classList.push(
                <li style={{
                    pointerEvents: "none",
                    fontSize: "12px",
                    padding: 0
                }}>No classed created yet</li>
            );
        }
        return (
            <div className="app-wrapper">
                <header className="app-header">
                    <h2>Class editor</h2>
                    <p>
                        <span>Describe generic device class</span>
                    </p>
                </header>
                <div className="app-container container-fluid">
                    <div className="col-md-2">
                        <h4>
                            <span>Class list </span>
                            <button className="btn btn-primary btn-add" title="Create new class" onClick={this.handleAddClassClick}>
                                <i className="fa fa-plus"></i>
                            </button></h4>
                        <ul className="class-list">
                            {
                                classList
                            }
                        </ul>
                    </div>
                    <ClassDetail classURI={this.state.currentClass}></ClassDetail>
                </div>
            </div>
        );
    }
}