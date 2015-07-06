"use strict";

let React = require('react');

import Store from '../stores/description-store';

export default class Header extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            result: null
        };
    }    

    handleClick() {
        this.setState({
            result: Store.generate()
        })
    }

    render() {
        let className = "result-overlay";

        if (this.state.result) {
            className += " visible";
        }
        return (
            <div>            
                <h2>ONTO cataLOG</h2>
                <p>
                    <span>Semi-automatic generation of semantic-based description for sensign devices</span>
                    <button className="btn btn-lg generate btn-primary" onClick={this.handleClick.bind(this)}>Generate!</button>
                </p>
                <div className={className}>
                    <div> 
                        <h3>Generated description:</h3>
                        <pre>
                            {this.state.result}
                        </pre>
                        <button className="btn" onClick={ () => { this.setState({ result: null }) } }>OK</button>
                    </div>
                </div>
            </div>
        );
    }
}
