"use strict";

import React from 'react';
import { Link } from 'react-router';
import UserBlock from './user-block.react';

const links = {
    'main': {
        to: '/',
        text: 'WoT SemDesc Helper'
    },
    'about': {
        to: '/about/',
        text: 'About'
    }
};

export default class Navigation extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            item: 'main'
        };

        this.handleMenuItemClick = (item) => {
            return (e) => {
                this.setState({
                    item: item
                });
            };
        };

    }

    render() {
        let items = [];
        for (let key in links) {
            items.push(
                <li key={key} className={this.state.item === key ? "active" : ""} onClick={this.handleMenuItemClick(key)}>
                    <Link to={links[key].to}>{links[key].text}</Link>
                </li>
            );
        }
        return (
            <nav className="navbar navbar-inverse">
                <ul>
                    {items}
                </ul>
                <UserBlock></UserBlock>
            </nav>
        );
    }
}