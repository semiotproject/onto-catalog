import uuid from 'uuid';
import { TurtlePrefixes } from '../prefixes';
import FieldStore from '../stores/field-store';

export function getDevice(
    label = "New Device",
    manufacturer = "",
    creator = {
        name: "",
        email: ""
    }
) {
    const creatorUUID = uuid.v4();
    return TurtlePrefixes + `
        semdesc:${uuid.v4()} rdfs:subClassOf ssn:System ;
            a prov:Entity, mmi:Device ;
            prov:wasAttributedTo semdesc:${creatorUUID} ;
            rdfs:label "${label}" ;
            mmi:hasManufacturer [
                a mmi:Manufacturer ;
                rdfs:label "${manufacturer}" ;
            ] .

        semdesc:${creatorUUID} a prov:Agent, prov:Person ;
            foaf:givenName "${creator.name}"^^xsd:string ;
            foaf:mbox <mailto:${creator.email}> ;
        .
    `;
}

export function getSensor(
    systemURI,
    label = "awesome sensor"
) {
    let defaultSensorType;

    if (!defaultSensorType) {
        const sensorTypes = FieldStore.getSensorTypes();
        if (sensorTypes.length === 0) {
            throw new Error('no sensor types found; possible SPARQL endpoint error');
        } else {
            defaultSensorType = sensorTypes[0].literal;
        }
    }

    let defaultUnits;

    if (!defaultUnits) {
        const units = FieldStore.getUnitsOfMeasurement();
        if (units.length === 0) {
            throw new Error('no units of measurement found; possible SPARQL endpoint error');
        } else {
            defaultUnits = units[0].literal;
        }
    }

    const sensorUUID = uuid.v4();
    return TurtlePrefixes + `
        <${systemURI}> ssn:hasSubSystem semdesc:${sensorUUID}.

        semdesc:${sensorUUID} a ssn:SensingDevice ;
            rdfs:label "${label}" ;
            ssn:observes <${defaultSensorType}> ;
            ssn:hasMeasurementCapability [
                a ssn:MeasurementCapability ;
                ssn:forProperty <${defaultSensorType}> ;
                ssn:hasMeasurementProperty [
                    a qudt:Unit ;
                    ssn:hasValue [
                        a qudt:Quantity ;
                        ssn:hasValue <${defaultUnits}> ;
                    ]
                ]
            ] .
    `;
}

export function getMeasurementProperty(
    measurementCapabilityURI,
    propType
) {

    const propUUID = uuid.v4();
    return TurtlePrefixes + `
        <${measurementCapabilityURI}> ssn:hasMeasurementProperty semdesc:${propUUID}.

        semdesc:${propUUID} a ${propType} ;
            ssn:hasValue [
                a qudt:QuantityValue ;
                ssn:hasValue "1.0"^^xsd:double ;
            ] .
    `;
}