import uuid from 'uuid';
import FieldStore from '../stores/field-store';

const MEASUREMENT_CAPABILITY_URI = 'semdesc:mc';

export function getModel(model) {
    const creatorUUID = uuid.v4();
    return `
        <${model.uri}> rdfs:subClassOf ssn:System ;
            a prov:Entity, mmi:Device ;
            prov:wasAttributedTo semdesc:${creatorUUID} ;
            rdfs:label "${model.label}" ;
            mmi:hasManufacturer [
                a mmi:Manufacturer ;
                rdfs:label "${model.manufacturer}" ;
            ] .

        semdesc:${model.creator.uri} a prov:Agent, prov:Person ;
            foaf:givenName "${model.creator.name}"^^xsd:string ;
            foaf:mbox <mailto:${model.creator.email}> .
    `;
}

export function getSensor(systemURI, sensor) {
    let str = `
        <${systemURI}> ssn:hasSubSystem semdesc:${sensor.uri}.

        semdesc:${sensor.uri} a ssn:SensingDevice ;
            rdfs:label "${sensor.label}" ;
            ssn:observes <${sensor.featureOfInterest}> ;
            ssn:hasMeasurementCapability ${MEASUREMENT_CAPABILITY_URI}-${sensor.uri} .

        ${MEASUREMENT_CAPABILITY_URI}-${sensor.uri} a ssn:MeasurementCapability ;
            ssn:forProperty <${sensor.featureOfInterest}> .
    `;
    if (sensor.unitsOfMeasurement) {
        str += `
            ${MEASUREMENT_CAPABILITY_URI}-${sensor.uri} ssn:hasMeasurementProperty [
                a qudt:Unit ;
                ssn:hasValue [
                    a qudt:Quantity ;
                    ssn:hasValue <${sensor.unitsOfMeasurement}> ;
                ]
            ] .
        `;
    }
    return str;
}

export function getMeasurementProperty(sensorURI, prop) {
    return `
        ${MEASUREMENT_CAPABILITY_URI}-${sensorURI} ssn:hasMeasurementProperty [
            a ${prop.type} ;
            ssn:hasValue [
                a qudt:QuantityValue ;
                ssn:hasValue "${prop.value}"^^xsd:double ;
            ]
        ].
    `;
}