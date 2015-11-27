import { Parser } from 'n3';
import $ from 'jquery';

export function parseTriples(turtle) {

    const parser = new Parser();
    const defer = $.Deferred();
    const triples = [];

    parser.parse(turtle, (err, triple) => {
        if (err) {
            console.error(`error while parsing triples: `, err);
            defer.reject();
        }
        if (triple) {
            triples.push(triple);
        } else {
            defer.resolve(triples);
        }
    });

    return defer;
}

export function getMockDevice() {
    return `
        @prefix :      <http://purl.org/NET/ssnext/communication#> .
@prefix qudt:  <http://www.qudt.org/qudt/owl/1.0.0/qudt/#> .
@prefix qudt-unit-1.1: <http://qudt.org/1.1/vocab/unit#> .
@prefix owl:   <http://www.w3.org/2002/07/owl#> .
@prefix gml:   <http://purl.org/ifgi/gml/0.2#> .
@prefix saref: <http://ontology.tno.nl/saref#> .
@prefix mmi:   <http://mmisw.org/ont/mmi/device#> .
@prefix xsd:   <http://www.w3.org/2001/XMLSchema#> .
@prefix emtr:  <http://purl.org/NET/ssnext/electricmeters#> .
@prefix skos:  <http://www.w3.org/2004/02/skos/core#> .
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix qudt-unit: <http://qudt.org/vocab/unit#> .
@prefix ssn:   <http://purl.oclc.org/NET/ssnx/ssn#> .
@prefix omvmmi: <http://mmisw.org/ont/mmi/20081020/ontologyMetadata/> .
@prefix geo:   <http://www.w3.org/2003/01/geo/wgs84_pos#> .
@prefix mcht:  <http://purl.org/NET/ssnext/machinetools#> .
@prefix dct:   <http://purl.org/dc/terms/> .
@prefix qudt-quantity: <http://qudt.org/vocab/quantity#> .
@prefix semdesc: <http://semdesc.semiot.ru/users/> .
@prefix omv:   <http://omv.ontoware.org/2005/05/ontology#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix DUL:   <http://www.loa-cnr.it/ontologies/DUL.owl#> .
@prefix vann:  <http://purl.org/vocab/vann/> .
@prefix prov:  <http://www.w3.org/ns/prov#> .
@prefix foaf:  <http://xmlns.com/foaf/0.1/> .
@prefix om:    <http://purl.org/ifgi/om#> .
@prefix qudt-quantity-1.1: <http://qudt.org/1.1/vocab/quantity#> .
@prefix cc:    <http://creativecommons.org/ns#> .
@prefix qudt-1.1: <http://qudt.org/1.1/schema/qudt#> .
@prefix quantity: <http://qudt.org/schema/quantity#> .
@prefix vaem:  <http://www.linkedmodel.org/schema/vaem#> .
@prefix em:    <http://purl.org/NET/ssnext/electricmeters#> .
@prefix voag:  <http://voag.linkedmodel.org/schema/voag#> .
@prefix dc11:  <http://purl.org/dc/elements/1.1/> .
@prefix geosparql: <http://purl.org/ifgi/geosparql#> .
@prefix unit:  <http://qudt.org/vocab/unit#> .
@prefix rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix ssncom: <http://purl.org/NET/ssnext/communication#> .
@prefix dul:   <http://www.loa-cnr.it/ontologies/DUL.owl#> .
@prefix time:  <http://www.w3.org/2006/time#> .
@prefix climate-feature: <https://purl.org//NET/ssnext/climate-feature#> .
@prefix qudt-dimension: <http://qudt.org/vocab/dimension#> .
@prefix creativecommons: <http://creativecommons.org/ns#> .
@prefix dc:    <http://purl.org/dc/elements/1.1/> .

<http://semdesc.semiot.ru/model#33b6bb4c-a0a6-4452-b15a-6e48b3f8fe47>
        a                     mmi:Device , prov:Entity ;
        rdfs:label            "" ;
        rdfs:subClassOf       ssn:System ;
        mmi:hasManufacturer   [ a           mmi:Manufacturer ;
                                rdfs:label  ""
                              ] ;
        ssn:hasSubSystem      <http://semdesc.semiot.ru/model#6a467b05-d7be-4b63-b860-b8880249556b> ;
        prov:wasAttributedTo  <http://semdesc.semiot.ru/model#3bbfae0e-765e-4b4e-bd3d-3c63a277d311> , semdesc:b154a30e-203a-4ea1-8267-b09a3b73183d .

<http://semdesc.semiot.ru/model#6a467b05-d7be-4b63-b860-b8880249556b>
        a                             ssn:SensingDevice ;
        rdfs:label                    "awesome sensor" ;
        ssn:hasMeasurementCapability  [ a                           ssn:MeasurementCapability ;
                                        ssn:forProperty             em:PolyphaseVoltage ;
                                        ssn:hasMeasurementProperty  [ a             ssn:Resolution ;
                                                                      ssn:hasValue  [ a                   dul:Amount ;
                                                                                      dul:hasDataValue    "3"^^xsd:double ;
                                                                                      dul:isClassifiedBy  climate-feature:RelativeHumidity
                                                                                    ]
                                                                    ] ;
                                        ssn:hasMeasurementProperty  [ a             ssn:Sensitivity ;
                                                                      ssn:hasValue  [ a                   dul:Amount ;
                                                                                      dul:hasDataValue    "2"^^xsd:double ;
                                                                                      dul:isClassifiedBy  climate-feature:RelativeHumidity
                                                                                    ]
                                                                    ] ;
                                        ssn:hasMeasurementProperty  [ a             ssn:Accuracy ;
                                                                      ssn:hasValue  [ a                   dul:Amount ;
                                                                                      dul:hasDataValue    "1"^^xsd:double ;
                                                                                      dul:isClassifiedBy  climate-feature:RelativeHumidity
                                                                                    ]
                                                                    ]
                                      ] ;
        ssn:observes                  em:PolyphaseVoltage .

<http://semdesc.semiot.ru/model#3bbfae0e-765e-4b4e-bd3d-3c63a277d311>
        a               prov:Person , prov:Agent ;
        foaf:givenName  "" ;
        foaf:mbox       <mailto:> .

<https://github.com/soylent-grin>
        a                  foaf:PersonalProfileDocument ;
        foaf:maker         semdesc:b154a30e-203a-4ea1-8267-b09a3b73183d ;
        foaf:primaryTopic  semdesc:b154a30e-203a-4ea1-8267-b09a3b73183d .

semdesc:b154a30e-203a-4ea1-8267-b09a3b73183d
        a                 prov:Agent , prov:Person , foaf:Person ;
        foaf:accountName  "soylent-grin" ;
        foaf:homepage     <https://github.com/soylent-grin> ;
        foaf:name         "soylent-grin" .

    `;
}