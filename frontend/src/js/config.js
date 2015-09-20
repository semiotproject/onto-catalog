"use strict";

const BACKEND_PORT = 3000;
const urlBase = `${location.protocol}//${location.hostname}:${BACKEND_PORT}/api/v1/`;

export default {
    BASE_CLASS_URI: "http://semdesc.semiot.ru/devices/classes/",
    URLS: {
        currentUser: urlBase + "current_user/",
        class: urlBase + "class/"
    }
};
