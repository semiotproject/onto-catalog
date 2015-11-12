"use strict";

import $ from 'jquery';
import React from 'react';
import { Router, IndexRoute, Route, Link, History } from 'react-router';

import App from './components/app.react';
import ModelList from './components/model/model-list.react';
import ModelDetail from './components/model/model-detail.react';
import InstanceDetail from './components/instance/instance-detail.react';
import Navigation from './components/nav.react';
import About from './components/about.react';

import CurrentUserStore from './stores/current-user-store';
import FieldStore from './stores/field-store';


$.when(
    CurrentUserStore.load(),
    FieldStore.load()
).always(() => {
    React.render(
        <Router>
            <Route path="/" component={App}>
                <IndexRoute component={ModelList}/>
                <Route path="/model" component={ModelList} />
                <Route path="/model/:uri" component={ModelDetail} />
                <Route path="/instance/:uri" component={InstanceDetail} />
                <Route path="/about/" component={About} />
            </Route>
        </Router>
    , document.querySelector('body'));
});