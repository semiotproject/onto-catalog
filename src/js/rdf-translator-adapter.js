"use strict";

import $ from 'jquery';

String.prototype.format = function() {
    var pattern = /\{\d+\}/g;
    var args = arguments;
    return this.replace(pattern, function(capture){ return args[capture.match(/\d+/)]; });
};

const BASE_URL = "http://rdf-translator.appspot.com/convert/{0}/{1}/content";

function serialize(obj) {
    var a = [];
    for (var p in obj) {
        a.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
    return a.join("&");
}

const request = (url, body) => {
    return $.ajax({
        type: "POST",
        url: url,
        contentType: "application/x-www-form-urlencoded",
        data: serialize({
            content: body
        })
    });
}


export default {
    turtleToJsonLd(turtle) {
        return request(BASE_URL.format('n3', 'json-ld'), turtle);
    },
    turtleToRdfXml(turtle) {
        return request(BASE_URL.format('n3', 'rdfa'), turtle);
    }
}