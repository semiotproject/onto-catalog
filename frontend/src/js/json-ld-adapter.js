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

const CONTEXT = _.assign(PREFIXES, {
    //
});
/*
  "@context": {
    "dul": "http://www.loa-cnr.it/ontologies/DUL.owl#",
    "geo": "http://www.w3.org/2003/01/geo/wgs84_pos#",
    "geosparql": "http://www.opengis.net/ont/geosparql#",
    "hmtr": "http://purl.org/NET/ssnext/heatmeters#",
    "limap": "http://data.uni-muenster.de/php/vocab/limap",
    "limapext": "http://purl.org/NET/limapext#",
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "rdfs": "http://www.w3.org/2000/01/rdf-schema#",
    "ssn": "http://purl.oclc.org/NET/ssnx/ssn#",
    "ssncom": "http://purl.org/NET/ssnext/communication#",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
  },
  "@graph": [
    {
      "@id": uri,
      "@type": "ssn:System",
      "rdfs:label": uri,
      'ssn:hasSubsystem':: json. [
        {
          "@id": "coap://10.1.1.1:6500:6500/meter/temperature"
        }
      ]
    },
    {
      "@id": "coap://10.1.1.1:6500:6500/meter/temperature",
      "@type": "ssn:Sensor",
      "ssn:observes": {
        "@id": "hmtr:Temperature"
      }
    }
  ]
 */
const TEMPLATE = {
    '@context': CONTEXT,
    '@graph': []
};

export function JSONLDtoClass(jsonld) {
    let model = {};

    let graph = jsonld['@graph'];

    graph.forEach((i, index) => {
        if (i['@type'] === "ssn:System") {
            model = {
                uri: i['@id'],
                label: i['rdfs:label'],
                createdBy: i['prov:wasAssociatedWith'],
                sensors: graph.filter((j) => {
                    return j['@type'] === 'ssn:Sensor';
                }).map((s, k) => {
                    return {
                        id: k,
                        type: s['ssn:observes']['@id']
                    };
                })
            };
        }
    });

    return model;
}

export function classToJSONLD(json) {
    // create immutable copy
    json = _.assign({}, json);
    let template = _.assign({}, TEMPLATE);
    let graph = template['@graph'];

    graph.push({
        '@id': json.uri,
        '@type': "ssn:System",
        'rdfs:label': json.label,
        'ssn:hasSubsystem': json.sensors.map((s, index) => {
            return {
                '@id': json.uri + '/sensor/' + s.id
            };
        })
    });


    template['@graph'] = graph.concat(json.sensors.map((s, index) => {
        return {
            '@id': json.uri + '/sensor/' + s.id,
            '@type': "ssn:Sensor",
            'ssn:observes': {
                '@id': s.type
            }
        };
    }));

    return template;
}