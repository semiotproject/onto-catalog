"use strict";

import React from 'react';
import $ from 'jquery';
import saveAs from 'browser-filesaver';

import RootView from './components/views/root.react.js';
import MetersView from './components/views/meters.react.js';
import MeterView from './components/views/meter.react.js';
import ActuatorsView from './components/views/actuators.react.js';
import ActuatorView from './components/views/actuator.react.js';
import DescriptionView from './components/views/description.react.js';
import ManufactureView from './components/views/manufacture.react.js';
import DeploymentView from './components/views/deployment.react.js';
import DriverView from './components/views/driver.react.js';

import ViewStore from './stores/view-store';
import DescriptionStore from './stores/description-store';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            types: {
                'json-ld': {
                    label: "JSON-LD",
                    ext: "txt",
                    inProgress: false
                },
                'n3': {
                    label: "N3",
                    ext: "txt",
                    inProgress: false
                },
                'rdf-xml': {
                    label: "RDF XML",
                    ext: "xml",
                    inProgress: false
                }
            }
        };
    }

    componentDidMount() {
        ViewStore.on('update', this.handleStoreUpdate.bind(this));
        DescriptionStore.on('update', this.handleStoreUpdate.bind(this));
    }
    componentWillUnmount() {
        ViewStore.removeListener('update', this.handleStoreUpdate.bind(this));
        DescriptionStore.removeListener('update', this.handleStoreUpdate.bind(this));
    }

    handleStoreUpdate() {
        // FIXME
        this.forceUpdate();
    }
    handleMeterAdd() {

    }
    handleActuatorAdd() {

    }

    setView(Component, payload = {}) {
        return (e) => {
            e.stopPropagation();
            ViewStore.setView(Component, payload);
        };
    }
    generateDescription(type) {
        return () => {
            let req;
            switch (type) {
                case 'json-ld':
                    req = DescriptionStore.generateJsonLd();
                break;
                case 'n3':
                    req = DescriptionStore.generateN3();
                break;
                case 'rdf-xml':
                    req = DescriptionStore.generateRdfXml();
                break;
                default:
                    console.warn(`unknown data type: ${type}`);
                break;
            }
            if (req) {
                let types = this.state.types;
                this.state.types[type].inProgress = true;
                this.setState({
                    types: types
                });
                $.when(req).done((res) => {
                    if (typeof res === 'object') {
                        res = JSON.stringify(res, null, 4);
                    }
                    console.log("description." + this.state.types[type].ext);
                    let blob = new Blob([res], {type: "text/plain;charset=utf-8"});
                    saveAs(blob, "description." + this.state.types[type].ext);
                    this.state.types[type].inProgress = false;
                    this.setState({
                        types: types
                    });
                });
            }
        };
    }

    renderButtons() {
        let buttons = [];

        let className = "btn btn-lg btn-primary btn-save";
        for (let type in this.state.types) {
            buttons.push(
                <button className={className + (this.state.types[type].inProgress ? " in-progress" : "")} onClick={this.generateDescription(type)}>
                    <i className="fa fa-download"></i>
                    <i className="fa fa-spin fa-cog"></i>
                    <span>{this.state.types[type].label}</span>
                </button>
            );
        }

        return buttons;
    }
    renderMiniMap() {
        let meters = DescriptionStore.getMeters();
        let actuators = DescriptionStore.getActuators();
        return (
            <div className="left">
                <header>
                    {this.renderButtons()}
                </header>
                <div className="minimap-container">
                    <div onClick={this.setView(RootView)}>
                        <h4>Device</h4>
                        <div className="children">
                            <div onClick={this.setView(DescriptionView)}>
                                <h4>Description</h4>
                                <div className="children">
                                    <div onClick={this.setView(ManufactureView)}>
                                        <h4>Manufacture</h4>
                                    </div>
                                    <div onClick={this.setView(DeploymentView)}>
                                        <h4>Deployment</h4>
                                    </div>
                                    <div onClick={this.setView(DriverView)}>
                                        <h4>Driver</h4>
                                    </div>
                                </div>
                            </div>
                            <div onClick={this.setView(MetersView)}>
                                <h4>
                                    <span>Meters</span>
                                    <button className="btn btn-primary btn-add" title="add" onClick={this.setView(MeterView, { id: null })}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </h4>
                                <div className="children">
                                    {
                                        meters.map((m) => {
                                            return (
                                                <div key={m.id} onClick={this.setView(MeterView, { id: m.id })}>
                                                    <h4>
                                                        {m.type} #{m.id}
                                                    </h4>
                                                </div>
                                            );
                                        })
                                    }
                                    {
                                        meters.length === 0 &&
                                            <span>No meters added yet</span>
                                    }
                                </div>
                            </div>
                            <div onClick={this.setView(ActuatorsView)}>
                                <h4>
                                    <span>Actuators</span>
                                    <button className="btn btn-primary btn-add" title="add" onClick={this.setView(ActuatorView, { id: null })}>
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </h4>
                                <div className="children">
                                    {
                                        actuators.map((m) => {
                                            return (
                                                <div key={a.id} onClick={this.setView(ActuatorView, { id: a.id })}>
                                                    <h4>
                                                        {a.type} #{a.id}
                                                    </h4>
                                                </div>
                                            );
                                        })
                                    }
                                    {
                                        actuators.length === 0 &&
                                            <span>No actuators added yet</span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    renderView() {
        let Component = ViewStore.getCurrentView() || RootView;
        let payload = ViewStore.getCurrentPayload();
        return (
            <div className="right">
                <Component data={payload}></Component>
            </div>
        );
    }
    render() {
        return (
            <div>
                <header className="app-header">
                    <h2>WoT SemDesc Helper</h2>
                    <p>
                        <span>Semi-automatic generation of semantic-based description for IoT devices</span>
                    </p>
                </header>
                <div className="app-container">
                    {this.renderMiniMap()}
                    {this.renderView()}
                </div>
            </div>
        );
    }
}

React.render(<App />, document.querySelector('#main-wrapper'));