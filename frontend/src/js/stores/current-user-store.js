"use strict";

import { EventEmitter } from 'events';
import $ from 'jquery';
import CONFIG from '../config';

class CurrentUserStore extends EventEmitter {
    constructor() {
        super();
        this._data = null;
    }
    getCurrentUser() {
        return this._data;
    }
    isEditable(model) {
        return this.isLoggedIn() && this._data.name === model.author;
    }
    isLoggedIn() {
        return this._data !== null;
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
