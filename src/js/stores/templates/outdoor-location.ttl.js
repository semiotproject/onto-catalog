"use strict";

export default `
    limap:hasLocalCoordinates [
        rdf:type limap:LocalCoordinates ;
        geosparql:hasGeometry "POLYGON((
                                    <%= latitude %> 0, 
                                    <%= longitude %> 0))"^^geo:wktLiteral .
    ] ;
`;