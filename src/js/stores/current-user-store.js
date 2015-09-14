"use strict";

import { EventEmitter } from 'events';
import $ from 'jquery';
import CONFIG from '../config';

class CurrentUserStore extends EventEmitter {
    constructor() {
        super();
    }
    getCurrentUser() {
        return this._data;
    }
    load() {
        return $.ajax({
            url: CONFIG.URLS.currentUser,
            success: (res) => {
                this._data = res;
            },
            error: () => {

            }
        });
    }
}

export default new CurrentUserStore();
