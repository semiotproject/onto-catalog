import uuid from 'uuid';
import FieldStore from '../stores/field-store';

const MEASUREMENT_CAPABILITY_URI = 'semdesc:mc';

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
            a <${prop.type}> ;
            ssn:hasValue [
                a qudt:QuantityValue ;
                ssn:hasValue "${prop.value}"^^xsd:double ;
            ]
        ].
    `;
}

export function getInstance(instance) {
    const instanceURI = uuid.v4();
    let str = `
        semdesc:${instanceURI} rdfs:subClassOf ssn:System, fipa:Device ;
            semdesc:hasPrototypeOf ${instance.model.uri};
            rdfs:label "${instance.label}" .
    `;
    if (instance.location) {
        str += `
            semdesc:${instanceURI} dul:hasLocation [
                a geo:Point ;
                geo:latitude "${instance.location.lat}" ;
                geo:longitude "${instance.location.lat}" ;
            ]
        `;
    }
    if (instance.deploymentTime) {
        str += `
            semdesc:${instanceURI} semdesc:hasDeploymentTime ${new Date(parseInt(instance.deploymentTime))}
        `;
    }
    if (instance.version) {
        str += `
            semdesc:${instanceURI} fipa:hasHwProperties [ a fipa:HwDescription ;
                    fipa:hasConnection [
                        a fipa:ConnectionDescription ;
                        fipa:hasConnectionInfo [
                            a fipa:InfoDescription ;
                            fipa:hasVersion "${instance.version}" .
                        ]
                    ]
                ] .
        `;
    }
    return str;
}