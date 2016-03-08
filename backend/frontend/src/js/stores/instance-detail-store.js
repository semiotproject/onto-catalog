import { EventEmitter } from 'events';
import $ from 'jquery';
import { loadModelDetail } from '../sparql-adapter';
import { modelFromTurtle } from '../turtle/converters/model';
import { instanceToTurtle } from '../turtle/converters/instance';
import saveAs from 'browser-filesaver';

class InstanceDetailStore extends EventEmitter {
    constructor() {
        super();
    }
    init(modelURI) {
        const promise = $.Deferred();

        loadModelDetail(modelURI).then((ttl) => {
            modelFromTurtle(ttl).then((model) => {
                console.log('parsed model: ', model);

                this._instance = {
                    placeholders: {
                        prefix: "placeholder.prefix",
                        id: "placeholder.id",
                        timestamp: "placeholder.timestamp",
                        value: "placeholder.value",
                        datetime: "placeholder.datetime",
                        location: "placeholder.location"
                    },
                    model
                };

                promise.resolve();
            });
        });
        return promise;
    }
    getInstance() {
        return this._instance;
    }
    setPlaceholder(key, value) {
        this._instance.placeholders[key] = value;
    }
    toTurtle() {
        return instanceToTurtle(this._instance);
    }
}

export default new InstanceDetailStore();