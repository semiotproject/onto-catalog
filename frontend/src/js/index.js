"use strict";

import $ from 'jquery';
import React from 'react';
import { Router, IndexRoute, Route, Link, History } from 'react-router';

import App from './components/app.react';
import ClassList from './components/class-list.react';
import ClassDetail from './components/class-detail.react';
import InstanceView from './components/instance.react';
import UserBlock from './components/user-block.react';

import CurrentUserStore from './stores/current-user-store';
import FieldStore from './stores/field-store';

$.when(
    CurrentUserStore.load(),
    FieldStore.load()
).always(() => {
    React.render(
        <Router>
            <Route path="/" component={App}>
                <IndexRoute component={ClassList}/>
                <Route path="/model" component={ClassList} />
                <Route path="/model/:uri" component={ClassDetail} />
                <Route path="/instance/:uri" component={InstanceView} />
            </Route>
        </Router>
    , document.querySelector('#app-wrapper'));
    React.render(<UserBlock />, document.getElementById('nav'));
});