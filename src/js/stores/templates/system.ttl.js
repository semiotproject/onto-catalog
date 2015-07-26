"use strict";

export default `
<<%= uri %>> a ssn:System ;
    rdfs:label "<%= label %>"
    <% _.forEach(sensors, function(s) { %>
    ;
    ssn:hasSubsystem <<%= uri %>/meter/<%= s.type %>>
    <% }); %>
`;

