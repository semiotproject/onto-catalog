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

export function loadUnitsOfMeasurement(featureOfInterest) {
   const promise = $.Deferred();
   getSparqlJsonResult(`
        SELECT ?literal ?label WHERE {
          ?literal a qudt:Unit ;
            qudt:quantityKind <${featureOfInterest}> ;
            rdfs:label ?label .
        }
    `).then((r) => {
        promise.resolve(r.results.bindings.map((b) => {
            return {
                label: b.label.value,
                literal: b.literal.value
            };
        }));
    });
   return promise;
}
export function loadSensorTypes() {
   const promise = $.Deferred();
   getSparqlJsonResult(`
        SELECT ?literal ?label {
          ?literal a ssn:Property ;
            rdfs:label ?label .
        }
    `).then((r) => {
        promise.resolve(r.results.bindings.map((b) => {
            return {
                label: b.label.value,
                literal: b.literal.value
            };
        }));
    });
   return promise;
}
