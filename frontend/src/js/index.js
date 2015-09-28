"use strict";

import $ from 'jquery';
import React from 'react';
import { Router, IndexRoute, Route, Link, History } from 'react-router';

import App from './components/app.react';
import ClassList from './components/class-list.react';
import ClassDetail from './components/class-detail.react';
import InstanceView from './components/instance.react';
import Navigation from './components/nav.react';
import About from './components/about.react';

import CurrentUserStore from './stores/current-user-store';
import FieldStore from './stores/field-store';

$.when(
    CurrentUserStore.load(),
    FieldStore.load()
).done(() => {
    React.render(
        <Router>
            <Route path="/" component={App}>
                <IndexRoute component={ClassList}/>
                <Route path="/model" component={ClassList} />
                <Route path="/model/:uri" component={ClassDetail} />
                <Route path="/instance/:uri" component={InstanceView} />
                <Route path="/about/" component={About} />
            </Route>
        </Router>
    , document.querySelector('body'));
});