"use strict";

import _ from 'lodash';

const PREFIXES = {
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "ssn": "http://purl.oclc.org/NET/ssnx/ssn#",
    "hmtr": "http://purl.org/NET/ssnext/heatmeters#",
    "ssncom": "http://purl.org/NET/ssnext/communication#",
    "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#>",
    "geosparql": "http://www.opengis.net/ont/geosparql#",
    "dul": "http://www.loa-cnr.it/ontologies/DUL.owl#",
    "limapext": "http://purl.org/NET/limapext#",
    "limap": "http://data.uni-muenster.de/php/vocab/limap",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
};

const CONTEXT = {
    "System": PREFIXES.ssn + "System",
    "Sensor": PREFIXES.ssn + "Sensor"
};

export function classToJSONLD(json) {
    // create immutable copy
    json = _.assign({}, json);

    // strip unused fields
    json.id = undefined;
    json.isNew = undefined;

    json['@id'] = json.uri;
    json.uri = undefined;

    json['@type'] = "System";

    json.sensors.forEach((s, index) => {
        json.sensors[index]['@id'] = json['@id'] + '/sensor/' + json.sensors[index].id;
        json.sensors[index].id = undefined;

        json.sensors[index]['@type'] = "Sensor";
    });

    json['@context'] = CONTEXT;

    return json;
}