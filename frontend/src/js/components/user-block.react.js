"use strict";

import CurrentUserStore from '../stores/current-user-store';
import CONFIG from '../config';
import React from 'react';

let logger = console;

export default class UserBlock extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            currentUser: CurrentUserStore.getCurrentUser()
        };
    }

    render() {
        let className = "user-block";
        if (this.state.currentUser === null) {
            className += " user-block--unauthorized";
        }
        let content;
        if (this.state.currentUser) {
            content = (
                <div className={className}>
                        <img src={this.state.currentUser.avatar_url} className="user-block__avatar"/>
                        <span className="user-block__username">{this.state.currentUser.username}</span>
                        <span>|</span>
                        <a href={CONFIG.URLS.logout} className="user-block__logout">logout</a>
                </div>
            );
        } else {
            content = (
                <div className={className}>
                    <a href={CONFIG.URLS.login} className="user-block__login">sign in with Github</a>
                </div>
            );
        }
        return content;
    }
}