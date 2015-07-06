"use strict";

let React = require('react');
let Router = require('react-router');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

import RootHandler from './root-handler.react';
import AppTab from './components/layouts/index';
import MeterTab from './components/layouts/meter/index';
import DescriptionTab from './components/layouts//meter/description/index';
import SensorUnitsTab from './components/layouts/meter/sensors/index';
import SensorUnit from './components/layouts/meter/sensors/unit/index';

import ManufactureTab from './components/layouts/meter/description/manufacture/index';
import DeploymentTab from './components/layouts/meter/description/deployment/index';
import DriversTab from './components/layouts/meter/description/drivers/index';

import Header from './components/header.react';

import Store from './stores/description-store';
// import ActuatorTab from './components/layouts/actuator/index';

let routes = (
    <Route path="/" name="OntoCatalog" handler={RootHandler}>
        <DefaultRoute handler={AppTab} /> 
        <Route name="Meter" path="meter" handler={RootHandler}>
            <DefaultRoute handler={MeterTab}/>  
            <Route name="Sensor units" path="units" handler={RootHandler}> 
                <DefaultRoute  handler={SensorUnitsTab}/>               
                <Route name="Single sensor" path="single/:id" handler={RootHandler}>
                     <DefaultRoute handler={SensorUnit}/> 
                </Route>                
            </Route>
            <Route name="Sensor description" path="description" handler={RootHandler}> 
                <DefaultRoute handler={DescriptionTab}/> 
                <Route name="Manufacture" path="manufacture" handler={ManufactureTab} />
                <Route name="Deployment" path="deployment" handler={DeploymentTab} />
                <Route name="Drivers" path="drivers" handler={DriversTab} />
            </Route>
        </Route>
    </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.querySelector('#main-wrapper'));
});

React.render(<Header />, document.querySelector('#header'));