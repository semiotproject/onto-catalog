"use strict";

export default `
<<%= uri %>> a <%= type %> ;
    rdfs:label "<%= label %>" ;
    <% _.forEach(sensors, function(s) { %>
    ssn:hasSubsystem <<%= uri %>/meter/<%= s.type %>> ;
    <% }); %>
`;

