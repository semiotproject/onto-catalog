import uuid from 'uuid';
import { TurtlePrefixes } from '../prefixes';

export function getDevice(
    label = "1",
    manufacturer = "2",
    creator = {
        name: "3",
        email: "4"
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
    label = "",
    observes = "emtr:PolyphaseVoltage",
    units = "climate-feature:RelativeHumidity"
) {
    return TurtlePrefixes + `
        semdesc:${uuid.v4()} a ssn:SensingDevice ;
            rdfs:label "${label}" ;
            ssn:observes ${observes} ;
            ssn:hasMeasurementCapability [
                a ssn:MeasurementCapability ;
                ssn:forProperty ${observes}
            ]
            ssn:hasMeasurementProperty [
                a ssn:Accuracy ;
                ssn:hasValue [
                    a DUL:Amount ;
                    DUL:hasDataValue "0"^^xsd:double ;
                    DUL:isClassifiedBy ${units}
                ]
            ] ;
            ssn:hasMeasurementProperty [
                a ssn:Sensitivity ;
                ssn:hasValue [
                    a DUL:Amount ;
                    DUL:hasDataValue "0"^^xsd:double ;
                    DUL:isClassifiedBy ${units}
                ]
            ] ;
            ssn:hasMeasurementProperty [
                a ssn:Resolution ;
                ssn:hasValue [
                    a DUL:Amount ;
                    DUL:hasDataValue "0"^^xsd:double ;
                    DUL:isClassifiedBy ${units}
                ]
            ]
    `;
}