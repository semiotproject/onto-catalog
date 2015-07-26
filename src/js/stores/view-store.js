"use strict";

import { EventEmitter } from 'events';

class ViewStore extends EventEmitter {
    constructor() {
        super();
        this._data = {
            currentView: null, // set default view to RootView in index.js to prevent circular deps
            currentPayload: {} // data, that transfer to detail component, e.g. sensor ID
        };
    }

    setView(view, payload = {}) {
        this._data = {
            currentView: view,
            currentPayload: payload
        }
        this.emit('update');
    }

    getCurrentView() {
        return this._data.currentView;
    }
    getCurrentPayload() {
        return this._data.currentPayload;
    }
}

export default new ViewStore();
