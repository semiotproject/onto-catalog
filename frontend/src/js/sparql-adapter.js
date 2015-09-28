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

function getJsonLdResult(query) {
    return getQueryResult(query, "application/ld+json");
}

export function loadClassList() {
    return getSparqlJsonResult(`
        SELECT ?uri ?author ?label WHERE {
          GRAPH ?uri {
            ?a rdfs:label ?label .
            ?a prov:wasAttributedTo ?c .
            ?c foaf:accountName ?author .
          } .
        }
    `);
    /*
    const promise = $.Deferred();

    promise.resolve(_.range(6).map((i) => {
        return {
            uri: 'http://example.com/' + i,
            label: 'Device #' + i,
            author: {
                username: 'soylent-grin'
            }
        };
    }));

    return promise;
    */
}
export function loadClassDetail(classURI) {
    return getSparqlJsonResult(`
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

    promise.resolve(['someprefix:Temperature', 'someprefix:Heat', 'someprefix:AirHumidity']);

   return promise;
}