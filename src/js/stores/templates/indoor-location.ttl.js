"use strict";

export default `
    limap:hasLocalCoordinates [
        rdf:type limap:LocalCoordinates ;
        geosparql:hasGeometry "POLYGON((
                                    <%= latitude %> 0, 
                                    <%= longitude %> 0))"^^geo:wktLiteral .
    ] ;
    limap:isLocated [
        rdf:type limap:EscapePlan ;
        limap:isEscapePlanOf [
            rdf:type limap:Floor ;
            dul:hasLocation [
                geo:floor "<%= floor %>"^^xsd:int .
            ],
            limap:isFloorIn [
                rdf:type limap:Building .
            ] .
        ] .
    ] .
`;

