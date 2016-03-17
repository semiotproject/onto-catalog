import uuid from 'uuid';
import FieldStore from '../../stores/field-store';

const MEASUREMENT_CAPABILITY_URI_PART = 'mc';

export function getModel(model) {
    return `
        <${model.uri}> rdfs:subClassOf ssn:System ;
            a prov:Entity, mmi:Device ;
            rdfs:label "${model.label}" ;
            mmi:hasManufacturer [
                a mmi:Manufacturer ;
                rdfs:label "${model.manufacturer}" ;
            ] .
    `;
}

export function getSensor(systemURI, sensor) {
    let str = `
        <${systemURI}> ssn:hasSubSystem <${sensor.uri}>.

        <${sensor.uri}> a ssn:SensingDevice ;
            rdfs:label "${sensor.label}" ;
            ssn:observes <${sensor.featureOfInterest}> ;
            ssn:hasMeasurementCapability <${sensor.uri}-${MEASUREMENT_CAPABILITY_URI_PART}> .

        <${sensor.uri}-${MEASUREMENT_CAPABILITY_URI_PART}> a ssn:MeasurementCapability ;
            ssn:forProperty <${sensor.featureOfInterest}> .
    `;
    if (sensor.unitsOfMeasurement) {
        str += `
            <${sensor.uri}-${MEASUREMENT_CAPABILITY_URI_PART}> ssn:hasMeasurementProperty [
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
        <${sensorURI}-${MEASUREMENT_CAPABILITY_URI_PART}> ssn:hasMeasurementProperty [
            a <${prop.type}> ;
            ssn:hasValue [
                a qudt:QuantityValue ;
                ssn:hasValue "${prop.value}"^^xsd:double ;
            ]
        ].
    `;
}