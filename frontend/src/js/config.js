"use strict";

const BACKEND_PORT = 8085;
const BACKEND_HOST = `${location.protocol}//${location.hostname}:${BACKEND_PORT}`;
const urlBase = `${BACKEND_HOST}/api/`;

export default {
    BASE_CLASS_URI: "http://semdesc.semiot.ru/devices/classes/",
    URLS: {
        login: urlBase + "login/",
        logout: urlBase + "logout/",
        currentUser: urlBase + "current_user/",
        class: urlBase + "class/"
    }
};
