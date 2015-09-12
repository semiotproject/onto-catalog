"use strict";

import { EventEmitter } from 'events';

class CurrentUserStore extends EventEmitter {
    constructor() {
        super();
    }
    load() {
        /*
        return request('/fds').then(() => {
            console.log('success!');
        }, (e) => {
            console.error('failed to load current user, error: ', e);
        });
        */
    }
}

export default new CurrentUserStore();
