"use strict";

export default `
    dul:hasLocation  [
        a geo:Point  ;
        geo:latitude  "<%= latitude %>"  ;
        geo:longitude  "<%= longitude %>"
    ]  .
`;