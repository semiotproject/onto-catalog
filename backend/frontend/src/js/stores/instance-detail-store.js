import { EventEmitter } from 'events';
import $ from 'jquery';
import { loadModelDetail } from '../sparql-adapter';
import { instanceToTurtle, fromTurtle, toTurtle } from '../turtle/converters';
import saveAs from 'browser-filesaver';

const DEFAULT_LOCATION = {
    lat: 60,
    lng: 30
};

class InstanceDetailStore extends EventEmitter {
    constructor() {
        super();
    }
    init(modelURI) {
        const promise = $.Deferred();

        loadModelDetail(modelURI).then((ttl) => {
            fromTurtle(ttl).then((model) => {
                console.log('parsed model: ', model);

                this._instance = {
                    model,
                    label: 'New instance',
                    deploymentTime: Date.now(),
                    location: {
                        lat: DEFAULT_LOCATION.lat,
                        lng: DEFAULT_LOCATION.lng
                    }
                };

                promise.resolve();
            });
        });
        return promise;
    }
    getInstance() {
        return this._instance;
    }
    saveAsTurtle() {
        const blob = new Blob([instanceToTurtle(this._instance)], {type: "text/plain;charset=utf-8"});
        const fileName = `${this._instance.label.toLowerCase().replace(' ', '_')}.ttl`;
        saveAs(blob, fileName);
    }
}

export default new InstanceDetailStore();