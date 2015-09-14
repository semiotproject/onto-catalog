"use strict";

export default `         
<<%= uri %>/meter/heat> a ssn:Sensor ;
    ssn:observes <%= observes %> ;
    ssncom:hasCommunicationEndpoint <<%= endpoint %>> .
 
<<%= endpoint %>> a ssncom:CommunicationEndpoint ;
    ssncom:protocol "<%= protocol %>" .
`;
