"use strict";

const BACKEND_PORT = 8085;
const BACKEND_HOST = `${location.protocol}//semdesc.semiot.ru:${BACKEND_PORT}`;
const proxyBase = `${BACKEND_HOST}/api/`;
const fusekiBase = `${BACKEND_HOST}/fuseki/wot_semdesc_helper/`;


export default {
    BASE_CLASS_URI: "http://semdesc.semiot.ru/devices/classes/",
    URLS: {
        login: proxyBase + "login/",
        logout: proxyBase + "logout/",
        currentUser: proxyBase + "login/user/",
        class: proxyBase + "class/",
        endpoint: fusekiBase
    }
};
