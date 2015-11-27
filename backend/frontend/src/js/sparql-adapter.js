"use strict";

import $ from 'jquery';
import _ from 'lodash';
import CONFIG from './config';
import { getMockDevice } from './utils';
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

    /*
   const promise = $.Deferred();

   promise.resolve(getMockDevice());

   return promise;
   */
}

export function loadUnitsOfMeasurement() {
   const promise = $.Deferred();

   getSparqlJsonResult(`
        SELECT DISTINCT ?literal ?label WHERE {
          <http://qudt.org/vocab/quantity#SystemOfQuantities_SI> <http://qudt.org/schema/qudt#systemDerivedQuantityKind> ?x.
          ?literal <http://qudt.org/schema/qudt#quantityKind> ?x;
            <http://www.w3.org/2000/01/rdf-schema#label> ?label
        }
    `).then((r) => {
        promise.resolve(r.results.bindings.map((b) => {
            return {
                label: b.label.value,
                literal: b.literal.value
            };
        }));
    });
    /*

    promise.resolve(['qudt:Celcium', 'qudt:Kelvin', 'qudt:Joule']);

   */
   return promise;
}
export function loadSensorTypes() {
   const promise = $.Deferred();

   /*
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
    */
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
