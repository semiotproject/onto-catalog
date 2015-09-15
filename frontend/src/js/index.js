"use strict";

import $ from 'jquery';
import React from 'react';

import ClassView from './components/class-view.react';
import InstanceView from './components/instance-view.react';
import UserBlock from './components/user-block.react';

import CurrentUserStore from './stores/current-user-store';
import ClassStore from './stores/class-store';

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
                    <UserBlock></UserBlock>
                </nav>
                <Component></Component>
            </div>
        );
    }
}

$.when(
    CurrentUserStore.load(),
    ClassStore.load()
).always(() => {
    React.render(<App />, document.querySelector('#main-wrapper'));
});