import uuid from 'uuid';
import _ from 'lodash';

// to avoid intersections with ES6 string substitutions
function insertPlaceholder(str) {
    return "${" + str + "}";
}

export function getInstanceDevice(instance) {
    const { placeholders } = instance;
    let str = `
<${insertPlaceholder(placeholders.prefix)}/${insertPlaceholder(placeholders.id)}> a ssn:System, proto:Individual ;
    proto:hasPrototype <${instance.model.uri}> ;
    dcterms:identifier "${insertPlaceholder(placeholders.id)}"^^xsd:string .
    `;

    if (placeholders.location && placeholders.location !== "") {
        str += `
<${insertPlaceholder(placeholders.prefix)}/${insertPlaceholder(placeholders.id)}>  geo:location [
    a geo:Point ;
    geo:lat "${insertPlaceholder(placeholders.location + '.' + 'latitude')}"^^xsd:string ;
        geo:long "${insertPlaceholder(placeholders.location + '.' + 'longitude')}"^^xsd:string ;
        geo:alt "${insertPlaceholder(placeholders.location + '.' + 'altitude')}"^^xsd:string
    ] .
        `;
    }

    instance.model.sensors.map((s) => {
        str += `
<${insertPlaceholder(placeholders.prefix)}/${insertPlaceholder(placeholders.id)}> ssn:hasSubSystem <${s.uri}-${insertPlaceholder(placeholders.id)}> .

<${s.uri}-${insertPlaceholder(placeholders.id)}>
    a ssn:SensingDevice, proto:Individual ;
    proto:hasPrototype <${s.uri}> ;
    dcterms:identifier "${insertPlaceholder(placeholders.id)}-${s.uri}"^^xsd:string .
        `;
    });
    return str;
}

export function getInstanceObservation(instance, sensorURI) {
    const { placeholders } = instance;
    const s = _.find(instance.model.sensors, (ss) => { return ss.uri === sensorURI; });
    let str = `
<${s.uri}-${insertPlaceholder(placeholders.id)}-${insertPlaceholder(placeholders.timestamp)}> a ssn:Observation ;
    ssn:observedProperty <${s.featureOfInterest}> ;
    ssn:observedBy <${s.uri}-${insertPlaceholder(placeholders.id)}> ;
    ssn:observationResultTime "${insertPlaceholder(placeholders.datetime)}"^^xsd:dateTime ;
    ssn:observationResult [
        a ssn:SensorOutput ;
        ssn:isProducedBy <${s.uri}-${insertPlaceholder(placeholders.id)}> ;
        ssn:hasValue [
            a qudt:QuantityValue ;
            qudt:quantityValue "${insertPlaceholder(placeholders.value)}"^^xsd:double
        ]
    ] .
    `;
    return str;
}