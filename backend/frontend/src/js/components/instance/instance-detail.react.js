import React from 'react';
import { Link } from 'react-router';
import Store from '../../stores/instance-detail-store';
import DateTimeField from 'react-bootstrap-datetimepicker';

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
        this.handleChange = (prop) => {
            return (e) => {
                console.info(`prop ${prop} changed to ${e}..`);
                //
            };
        };
    }

    componentDidMount() {
        Store.init(this.props.params.uri).done(() => {
            this.setState({
                isLoading: false
            });
        });
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
                        onChange={this.handleChange('label')}
                    />
                </div>
                <div className="form-group">
                    <label>Deployment Time</label>
                    <DateTimeField
                        ref="deploymentTime"
                        dateTime={instance.deploymentTime}
                        onChange={this.handleChange('deploymentTime')}
                    />
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