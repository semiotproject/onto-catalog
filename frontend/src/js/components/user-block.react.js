"use strict";

import CurrentUserStore from '../stores/current-user-store';
import React from 'react';

let logger = console;

export default class UserBlock extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {
            currentUser: CurrentUserStore.getCurrentUser()
        };

        // ex-componentWillMount hooks
        logger.info('will mount');

        // UI and stores handlers declaration


    }

    // lifecycle methods
    componentDidMount() {
        logger.info('mounting..');
    }
    componentWillReceiveProps(nextProps) {
        logger.info('props received');
    }
    componentWillUpdate(nextProps, nextState) {
        logger.info('will update');
    }
    componentDidUpdate(prevProps, prevState) {
        logger.info('did update');
    }
    componentWillUnmount() {
        logger.info('unmounting..');
    }

    // common helpers


    // render helpers


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
                        <span className="user-block__username">{this.state.currentUser.login}</span>
                        <span>|</span>
                        <a href="/logout" className="user-block__logout">logout</a>
                </div>
            );
        } else {
            content = (
                <div className={className}>
                    <a href="/login" className="user-block__login">sign in with Github</a>
                </div>
            );
        }
        return content;
    }
}

UserBlock.propTypes = {

};

UserBlock.defaultProps = {

};
