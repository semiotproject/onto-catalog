"use strict";

import _ from 'lodash';
import uuid from 'uuid';

export function ClassTemplate() {
    return {
        "@type": "prov:Entity",
        "rdfs:label": {
            "@language": "en",
            "@value": "New system"
        },
        "rdfs:subClassOf": "ssn:System",
        "ssn:hasSubSystem": [

        ],
        uri: "_:" + uuid.v4()
    };
}

export const PropertyTemplate = {
    'Sensitivity': function() {
        return {
            "@type": "ssn:Sensitivity",
            "ssn:hasValue": {
                "@type": "DUL:Amount",
                "DUL:hasDataValue": {
                    "xsd1:double": "",
                    uri: "_:" + uuid.v4()
                },
                "DUL:isClassifiedBy": "",
                uri: "_:" + uuid.v4()
            },
            uri: "_:" + uuid.v4()
        };
    },
    'Accuracy': function() {
        return {
            "@type": "ssn:Accuracy",
            "ssn:hasValue": {
                "@type": "DUL:Amount",
                "DUL:hasDataValue": {
                    "xsd1:double": "",
                    uri: "_:" + uuid.v4()
                },
                "DUL:isClassifiedBy": "{1}",
                uri: "_:" + uuid.v4()
            },
            uri: "_:" + uuid.v4()
        };
    }
};

export function SensorTemplate() {
    let props = [];
    for (let key in PropertyTemplate) {
        props.push(PropertyTemplate[key]());
    }
    return {
        "@type": "ssn:Sensor",
        "ssn:hasMeasurementCapability": {
            "@type": "ssn:MeasurementCapability",
            "ssn:forProperty": "someprefix:AirTemperature", // TODO: make this dynamically
            "ssn:hasMeasurementProperty": props,
            "uri": "_:" + uuid.v4()
        },
        "ssn:observes": "someprefix:AirTemperature",
        "uri": "_:" + uuid.v4()
    };
}