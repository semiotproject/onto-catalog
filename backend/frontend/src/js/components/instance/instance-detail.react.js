import React from 'react';
import { Link } from 'react-router';
import Store from '../../stores/instance-detail-store';
import DateTimeField from 'react-bootstrap-datetimepicker';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

import { constructURIFromUUID } from '../../utils';

const AVAILABLE_FORMATS = {
    ttl: {
        label: "Turtle"
    }
};

export default class InstanceView extends React.Component {
    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            isLoading: true
        };

        this.handleSaveClick = (format) => {
            return () => {
                console.info(`downloading instance description in ${format}..`);
                Store.saveAsTurtle();
            };
        };
        this.handleChange = (prop, getValue) => {
            return (e) => {
                console.info(`prop ${prop} changed to `, e);
                const instance = Store.getInstance();
                instance[prop] = getValue.call(this);
                console.log(instance);
                this.forceUpdate();
            };
        };
        this.handleTimeChange = (e) => {
            console.info(`time changed to ${JSON.stringify(e)}..`);
            const instance = Store.getInstance();
            instance.deploymentTime = e;
            this.forceUpdate();
        };
        this.handleLocationChange = (e) => {
            console.info(`location changed to ${JSON.stringify(e.latlng)}..`);
            const instance = Store.getInstance();
            instance.location = e.latlng;
            this.forceUpdate();
        };
    }

    componentDidMount() {
        Store.init(this.getURI()).done(() => {
            this.setState({
                isLoading: false
            });
        });
    }

    getLabel() {
        return this.refs.label.value;
    }
    getLabel() {
        return this.refs.version.value;
    }
    getDeploymentTime() {
        return this.refs.deploymentTime.value;
    }


    getURI() {
        return constructURIFromUUID(this.props.params.uri);
    }


    // render helpers
    renderView() {
        if (this.state.isLoading) {
            return "loading..";
        }
        const instance = Store.getInstance();
        return (
            <div className="col-md-6" style={{ float: 'none', margin: '0 auto' }}>
                <h3>Instance of the model "{instance.model.label}"</h3>
                <div className="form-group" style={{ textAlign: "center" }}>
                    {
                        Object.keys(AVAILABLE_FORMATS).map((f) => {
                            return (
                                <button className="btn btn-primary" onClick={this.handleSaveClick(f)} key={f}>
                                    <i className="fa fa-download"></i>
                                    &nbsp;
                                    {AVAILABLE_FORMATS[f].label}
                                </button>
                            );
                        })
                    }
                </div>
                <div className="form-group">
                    <label>Label</label>
                    <input
                        type="text"
                        className="form-control"
                        ref="label"
                        value={instance.label}
                        onChange={this.handleChange('label', this.getLabel)}
                    />
                </div>
                <div className="form-group">
                    <label>Version</label>
                    <input
                        type="text"
                        className="form-control"
                        ref="version"
                        value={instance.version}
                        onChange={this.handleChange('version', this.getVersion)}
                    />
                </div>
                <div className="form-group">
                    <label>Deployment Time</label>
                    <DateTimeField
                        ref="deploymentTime"
                        dateTime={instance.deploymentTime}
                        onChange={this.handleTimeChange}
                    />
                </div>
                <div className="form-group">
                    <label>Deployemnt Location</label>
                    <div style={{
                        height: "300px"
                    }}>
                        <Map center={[60, 30]} zoom={7} style={{
                            height: "300px",
                            width: "100%"
                        }} onLeafletClick={this.handleLocationChange}>
                            <TileLayer
                                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            />
                            <Marker position={instance.location}></Marker>
                        </Map>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="app-wrapper">
                <div className="app-header">
                    <div>
                        <Link to="/">
                            <button className="btn btn-primary" style={{
                                position: "absolute",
                                left: "20px",
                                top: "30px"
                            }}><i className="fa fa-arrow-circle-left"></i>&nbsp;Back</button>
                        </Link>
                        <h3>Instance View</h3>
                        <p>Generate description based on one of device models</p>
                    </div>
                </div>
                <div className="app-container">
                    {this.renderView()}
                </div>
            </div>
        );
    }
}