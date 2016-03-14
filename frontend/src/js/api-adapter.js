import $ from 'jquery';
import { URLS } from './config';

export function createModel(ttl) {
    return $.ajax({
        type: "POST",
        url: URLS.model,
        data: ttl.replace(/\n/g, " "),
        contentType: "text/turtle"
    });
}

export function updateModel(uri, ttl) {
    return $.ajax({
        type: "PUT",
        url: URLS.model + encodeURIComponent(uri),
        data: ttl.replace(/\n/g, " "),
        contentType: "text/turtle"
    });
}


export function removeModel(uri) {
    return $.ajax({
        type: "DELETE",
        url: URLS.model + encodeURIComponent(uri)
    });
}
