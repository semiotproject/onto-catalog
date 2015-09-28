"use strict";

const BACKEND_PORT = 80;
const BACKEND_HOST = `${location.protocol}//${location.hostname}:${BACKEND_PORT}`;
const proxyBase = `${BACKEND_HOST}/api/`;
const fusekiBase = `${BACKEND_HOST}/fuseki/ds/sparq/`;

export default {
    BASE_CLASS_URI: "http://semdesc.semiot.ru/model/",
    URLS: {
        login: proxyBase + "login/",
        logout: proxyBase + "logout/",
        currentUser: proxyBase + "login/user/",
        class: proxyBase + "class/",
        endpoint: fusekiBase
    }
};
