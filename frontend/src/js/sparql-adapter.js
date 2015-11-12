"use strict";

import $ from 'jquery';
import _ from 'lodash';
import CONFIG from './config';
import { SPARQLPrefixes } from './prefixes';

function getQueryResult(query, accept) {
    return $.ajax({
        url: CONFIG.URLS.endpoint,
        data: {
            query: SPARQLPrefixes + query
        },
        headers: {
            Accept: accept
        },
        error() {
            console.error('failed to execute query: ', query);
        }
    });
}

function getSparqlJsonResult(query) {
    return getQueryResult(query, "application/sparql-results+json");
}

function getTurtleResult(query) {
    return getQueryResult(query, "application/turtle");
}

export function loadModelList() {
    return getSparqlJsonResult(`
        SELECT ?uri ?author ?label WHERE {
          GRAPH ?uri {
            ?a rdfs:label ?label .
            ?a prov:wasAttributedTo ?c .
            ?c foaf:accountName ?author .
          } .
        }
    `);
}
export function loadModelDetail(classURI) {
    return getTurtleResult(`
        CONSTRUCT { ?a ?b ?c . } WHERE {
           GRAPH <${classURI}> { ?a ?b ?c } .
        }
    `);
}

export function loadMeasurementProperties() {
    /*
    return getSparqlJsonResult(`
        TODO
    `);
    */
   const promise = $.Deferred();

    promise.resolve(['ssn:Accuracy', 'ssn:ssn:Sensitivity']);

   return promise;
}
export function loadUnitsOfMeasurement() {
    /*
    return getSparqlJsonResult(`
        TODO
    `);
    */
   const promise = $.Deferred();

    promise.resolve(['qudt:Celcium', 'qudt:Kelvin', 'qudt:Joule']);

   return promise;
}
export function loadSensorTypes() {
    /*
    return getSparqlJsonResult(`
        TODO
    `);
    */
   const promise = $.Deferred();

   promise.resolve([
        {
            literal: "http://purl.org/NET/ssnext/electricmeters#PolyphaseVoltage",
            label: "Polyphase voltage"
        },
        {
            literal: "http://purl.org/NET/ssnext/electricmeters#PolyphaseAmperage",
            label: "Polyphase amperage"
        },
        {
            literal: "http://purl.org/NET/ssnext/electricmeters#PolyphaseElectricActivePower",
            label: "Polyphase electric active power"
        }
    ]);

   return promise;
}