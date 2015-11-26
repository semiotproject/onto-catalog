import uuid from 'uuid';
import { TurtlePrefixes } from '../prefixes';

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
    label = "awesome sensor",
    observes = "emtr:PolyphaseVoltage",
    units = "climate-feature:RelativeHumidity"
) {
    const sensorUUID = uuid.v4();
    return TurtlePrefixes + `
        <${systemURI}> ssn:hasSubSystem semdesc:${sensorUUID}.

        semdesc:${sensorUUID} a ssn:SensingDevice ;
            rdfs:label "${label}" ;
            ssn:observes ${observes} ;
            ssn:hasMeasurementCapability [
                a ssn:MeasurementCapability ;
                ssn:forProperty ${observes} ;
                ssn:hasMeasurementProperty [
                    a ssn:Accuracy ;
                    ssn:hasValue [
                        a dul:Amount ;
                        dul:hasDataValue "1"^^xsd:double ;
                        dul:isClassifiedBy ${units}
                    ]
                ] ;
                ssn:hasMeasurementProperty [
                    a ssn:Sensitivity ;
                    ssn:hasValue [
                        a dul:Amount ;
                        dul:hasDataValue "2"^^xsd:double ;
                        dul:isClassifiedBy ${units}
                    ]
                ] ;
                ssn:hasMeasurementProperty [
                    a ssn:Resolution ;
                    ssn:hasValue [
                        a dul:Amount ;
                        dul:hasDataValue "3"^^xsd:double ;
                        dul:isClassifiedBy ${units}
                    ]
                ]
            ] .
    `;
}