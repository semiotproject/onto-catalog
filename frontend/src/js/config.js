"use strict";

const BACKEND_PORT = 80;
const BACKEND_HOST = `${location.protocol}//semdesc.semiot.ru:${BACKEND_PORT}`;
const proxyBase = `${BACKEND_HOST}/api/`;
const fusekiBase = `http://semdesc.semiot.ru/fuseki`;

export default {
    SEMDESC_PREFIX: "http://semdesc.semiot.ru/model/",
    URLS: {
        login: proxyBase + "login/",
        logout: proxyBase + "logout/",
        currentUser: proxyBase + "login/user/",
        model: proxyBase + "model/",
        endpoint: {
            private: fusekiBase + "/private/sparql",
            public: fusekiBase + "/default/sparql"
        }
    }
};
