"use strict";

let React = require('react');
let Router = require('react-router');
let Route = Router.Route;
let DefaultRoute = Router.DefaultRoute;

import RootHandler from './root-handler.react';
import AppTab from './components/layouts/index';
import MeterTab from './components/layouts/meter/index';
import DescriptionTab from './components/layouts//meter/description/index';
import SensorUnitsTab from './components/layouts/meter/sensor-units/index';
import SensorUnit from './components/layouts/meter/sensor-units/unit/index';
import NewSensorUnitTab from './components/layouts/meter/sensor-units/unit/new/index';

import HumidityTab from './components/layouts/meter/sensor-units/unit/new/humidity/index';
import HeatTab from './components/layouts/meter/sensor-units/unit/new/heat/index';

import Store from './stores/description-store';
// import ActuatorTab from './components/layouts/actuator/index';

let routes = (
    <Route path="/" name="OntoCatalog" handler={RootHandler}>
        <DefaultRoute handler={AppTab}/> 
        <Route name="Meter" path="meter" handler={RootHandler}>
            <DefaultRoute handler={MeterTab}/>  
            <Route name="Sensor units" path="units" handler={RootHandler}> 
                <DefaultRoute  handler={SensorUnitsTab}/>               
                <Route name="New sensor" path="new" handler={RootHandler}>
                     <DefaultRoute handler={NewSensorUnitTab}/> 
                     <Route name="Humidity" path="humidity" handler={HumidityTab} /> 
                     <Route name="Heat" path="heat" handler={HeatTab} /> 
                </Route>                
                <Route name="Sensor unit" path=":id" handler={SensorUnit}></Route> 
            </Route>
            <Route name="Sensor description" path="description" handler={RootHandler}> 
                <DefaultRoute handler={DescriptionTab}/> 
            </Route>
        </Route>
    </Route>
);

Router.run(routes, Router.HashLocation, (Root) => {
  React.render(<Root/>, document.querySelector('#main-wrapper'));
});