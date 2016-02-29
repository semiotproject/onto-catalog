"use strict";

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, IndexRoute, Route, Link, browserHistory } from 'react-router';

import App from './components/app.react';
import ModelList from './components/model/model-list.react';
import { ModelDetailCreate, ModelDetailUpdate } from './components/model/model-detail.react';
import InstanceDetail from './components/instance/instance-detail.react';
import Navigation from './components/nav.react';
import About from './components/about.react';

import CurrentUserStore from './stores/current-user-store';
import FieldStore from './stores/field-store';


$.when(
    CurrentUserStore.load(),
    FieldStore.load()
).always(() => {
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={ModelList}/>
                <Route path="model" component={ModelList} />
                <Route path="model/new" component={ModelDetailCreate} />
                <Route path="model/:uri" component={ModelDetailUpdate} />
                <Route path="instance/:uri" component={InstanceDetail} />
                <Route path="about/" component={About} />
            </Route>
        </Router>
    , document.querySelector('#main-wrapper'));
});