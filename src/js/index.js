"use strict";

import React from 'react';

import ClassView from './components/class-view.react';
import InstanceView from './components/instance-view.react';

const VIEWS = {
    class: {
        title: 'Class',
        component: ClassView
    },
    instance: {
        title: 'Instance',
        component: InstanceView
    }
};

export default class App extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            view: "class"
        };

        // ex-componentWillMount hooks

        // UI and stores handlers declaration
        this.handleMenuClick = (item) => {
            return () => {
                this.setState({
                    view: item
                });
            };
        };

    }

    // common helpers


    // render helpers


    render() {
        let Component = VIEWS[this.state.view].component;
        let menu = [];
        for (let item in VIEWS) {
            menu.push(
                <li
                    key={item}
                    className={this.state.view === item ? "active" : ""}
                    onClick={this.handleMenuClick(item)}
                >
                    {VIEWS[item].title}
                </li>
            );
        }
        return (
            <div>
                <nav className="navbar navbar-inverse">
                    <ul>
                        {menu}
                    </ul>
                </nav>
                <Component></Component>
            </div>
        );
    }
}

App.propTypes = {

};

App.defaultProps = {

};


React.render(<App />, document.querySelector('#main-wrapper'));