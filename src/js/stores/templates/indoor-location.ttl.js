"use strict";

export default `
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

