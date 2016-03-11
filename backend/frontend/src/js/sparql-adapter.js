"use strict";

import $ from 'jquery';
import _ from 'lodash';
import CONFIG from './config';
import { SPARQLPrefixes } from './prefixes';

function getQueryResult(url, query, accept) {
    console.log(CONFIG.URLS.endpoint);
    return $.ajax({
        type: "POST",
        url,
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

function getPrivateQueryResult(query, accept) {
    return getQueryResult(CONFIG.URLS.endpoint.private, query, accept);
}

function getPublicQueryResult(query, accept) {
    return getQueryResult(CONFIG.URLS.endpoint.public, query, accept);
}

function getPrivateSparqlJsonResult(query) {
    return getPrivateQueryResult(query, "application/sparql-results+json");
}

function getPrivateTurtleResult(query) {
    return getPrivateQueryResult(query, "application/turtle");
}

function getPublicSparqlJsonResult(query) {
    return getPublicQueryResult(query, "application/sparql-results+json");
}

function getPublicTurtleResult(query) {
    return getPublicQueryResult(query, "application/turtle");
}

export function loadModelList() {
    return getPrivateSparqlJsonResult(`
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
    return getPrivateTurtleResult(`
        CONSTRUCT { ?a ?b ?c . } WHERE {
           GRAPH <${classURI}> { ?a ?b ?c } .
        }
    `);
}

export function loadUnitsOfMeasurement(featureOfInterest) {
   const promise = $.Deferred();
   getPublicSparqlJsonResult(`
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
   getPublicSparqlJsonResult(`
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
