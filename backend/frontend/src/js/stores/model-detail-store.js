import $ from 'jquery';
import _ from 'lodash';
import EventEmitter from 'events';
import CONFIG from '../config';
import CurrentUserStore from '../stores/current-user-store';
import { loadModelDetail } from '../sparql-adapter';
import { fromTurtle, toTurtle } from '../turtle/converters';
import { createModel, updateModel } from "../api-adapter";
import FieldStore from './field-store';
import uuid from 'uuid';


const MOCK_MODEL = `
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
@prefix ssn: <http://purl.oclc.org/NET/ssnx/ssn#>.
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>.
@prefix ssncom: <http://purl.org/NET/ssnext/communication#>.
@prefix saref: <http://ontology.tno.nl/saref#>.
@prefix mcht: <http://purl.org/NET/ssnext/machinetools#>.
@prefix qudt: <http://qudt.org/schema/qudt#>.
@prefix qudt-quantity: <http://qudt.org/vocab/quantity#>.
@prefix qudt-unit: <http://qudt.org/vocab/unit#>.
@prefix mmi: <http://mmisw.org/ont/mmi/device#>.
@prefix om: <http://purl.org/ifgi/om#>.
@prefix prov: <http://www.w3.org/ns/prov#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix dul: <http://www.loa-cnr.it/ontologies/DUL.owl#>.
@prefix emtr: <http://purl.org/NET/ssnext/electricmeters#>.
@prefix climate-feature: <https://purl.org//NET/ssnext/climate-feature#>.
@prefix semdesc: <http://semdesc.semiot.ru/model/>.

        <http://semdesc.semiot.ru/model/403bc913-a6b4-4fca-84d6-22c9281a1a6b> rdfs:subClassOf ssn:System ;
            a prov:Entity, mmi:Device ;
            prov:wasAttributedTo semdesc:7ce98f6e-f891-4295-87b8-c3c8ef2da1be ;
            rdfs:label "label" ;
            mmi:hasManufacturer [
                a mmi:Manufacturer ;
                rdfs:label "manufacturer" ;
            ] .

        semdesc:7ce98f6e-f891-4295-87b8-c3c8ef2da1be a prov:Agent, prov:Person ;
            foaf:givenName "soylent-grin"^^xsd:string ;
            foaf:mbox <mailto:hocico16@gmail.com> .

        <http://semdesc.semiot.ru/model/403bc913-a6b4-4fca-84d6-22c9281a1a6b> ssn:hasSubSystem semdesc:40b59b3d-2534-4925-8c15-75bc71baf73c.

        semdesc:40b59b3d-2534-4925-8c15-75bc71baf73c a ssn:SensingDevice ;
            rdfs:label "New sensor" ;
            ssn:observes <http://qudt.org/vocab/quantity#TimeSquared> ;
            ssn:hasMeasurementCapability semdesc:mc-40b59b3d-2534-4925-8c15-75bc71baf73c .

        semdesc:mc-40b59b3d-2534-4925-8c15-75bc71baf73c a ssn:MeasurementCapability ;
            ssn:forProperty <http://qudt.org/vocab/quantity#TimeSquared> .

            semdesc:mc-40b59b3d-2534-4925-8c15-75bc71baf73c ssn:hasMeasurementProperty [
                a qudt:Unit ;
                ssn:hasValue [
                    a qudt:Quantity ;
                    ssn:hasValue <http://qudt.org/vocab/unit#SecondTimeSquared> ;
                ]
            ] .

        semdesc:mc-40b59b3d-2534-4925-8c15-75bc71baf73c ssn:hasMeasurementProperty [
            a <http://purl.oclc.org/NET/ssnx/ssn#Drift> ;
            ssn:hasValue [
                a qudt:QuantityValue ;
                ssn:hasValue "1"^^xsd:double ;
            ]
        ].

        semdesc:mc-40b59b3d-2534-4925-8c15-75bc71baf73c ssn:hasMeasurementProperty [
            a <http://purl.oclc.org/NET/ssnx/ssn#Sensitivity> ;
            ssn:hasValue [
                a qudt:QuantityValue ;
                ssn:hasValue "1"^^xsd:double ;
            ]
        ].

        semdesc:mc-40b59b3d-2534-4925-8c15-75bc71baf73c ssn:hasMeasurementProperty [
            a <http://purl.oclc.org/NET/ssnx/ssn#Selectivity> ;
            ssn:hasValue [
                a qudt:QuantityValue ;
                ssn:hasValue "1"^^xsd:double ;
            ]
        ].

        <http://semdesc.semiot.ru/model/403bc913-a6b4-4fca-84d6-22c9281a1a6b> ssn:hasSubSystem semdesc:2894e85b-ad9e-4052-a1d2-d298d91fd2e7.

        semdesc:2894e85b-ad9e-4052-a1d2-d298d91fd2e7 a ssn:SensingDevice ;
            rdfs:label "New sensor" ;
            ssn:observes <http://qudt.org/vocab/quantity#AreaTime> ;
            ssn:hasMeasurementCapability semdesc:mc-2894e85b-ad9e-4052-a1d2-d298d91fd2e7 .

        semdesc:mc-2894e85b-ad9e-4052-a1d2-d298d91fd2e7 a ssn:MeasurementCapability ;
            ssn:forProperty <http://qudt.org/vocab/quantity#AreaTime> .
    `;

class ModelDetailStore extends EventEmitter {

    get MEASUREMENT_PROPERTIES() {
        return [
            'Drift',
            'Sensitivity',
            'Selectivity',
            'Accuracy',
            'MeasurementRange',
            'DetectionLimit',
            'Precision',
            'Frequency',
            'ResponseTime',
            'Latency',
            'Resolution'
        ].map((p) => {
            return {
                label: p,
                type: `http://purl.oclc.org/NET/ssnx/ssn#${p}`
            };
        });
    }

    constructor() {
        super();
    }
    init(uri) {
        if (!uri) {
            return this._createModel();
        }
        return this._loadModel(uri);
    }
    _createModel() {
        const promise = $.Deferred();
        promise.resolve();

        const user = CurrentUserStore.getCurrentUser();

        this._model = {
            uri: CONFIG.SEMDESC_PREFIX + uuid.v4(),
            label: 'label',
            manufacturer: 'manufacturer',
            creator: {
                uri: 'semdesc:' + uuid.v4(),
                email: user.email,
                name: user.name
            },
            sensors: []
        };
        return promise;
    }
    _loadModel(uri) {
        const promise = $.Deferred();

        loadModelDetail(uri).then((ttl) => {
            fromTurtle(ttl).then((model) => {
                console.log('parsed model: ', model);
                this._model = model;
                promise.resolve();
            });
        });

        return promise;
    }
    getModel() {
        return this._model;
    }
    addSensor() {
        const newSensorURI = uuid.v4();

        this._model.sensors.push({
            uri: newSensorURI,
            label: 'New sensor',
            featureOfInterest: this.getDeafultFeatureOfInterest(),
            getUnitsOfMeasurement: this.getDefaultUnitsOfMeasurement(),
            props: []
        });
        this.triggerUpdate();

        return newSensorURI;
    }
    removeSensor(uri) {
        _.remove(this._model.sensors, (s) => { return s.uri === uri; });
    }
    getDeafultFeatureOfInterest() {
        let featureOfInterest;
        const sensorTypes = FieldStore.getSensorTypes();
        if (sensorTypes.length === 0) {
            throw new Error('no sensor types found; possible SPARQL endpoint error');
        } else {
            featureOfInterest = sensorTypes[0].literal;
        }
        return featureOfInterest;
    }
    getDefaultUnitsOfMeasurement() {
        let defaultUnits;
        const units = FieldStore.getUnitsOfMeasurement();
        if (units.length > 0) {
            defaultUnits = units[0].literal;
        }
        return defaultUnits;
    }

    triggerUpdate() {
        console.info('current model is ', this._model, '; triggering update');
        this.emit('update');
    }

    save() {
        const ttl = toTurtle(this._model);
        console.log(`creating new model: ${ttl}`);
        createModel(ttl);
    }
    update() {
        const ttl = toTurtle(this._model);
        console.log(`updating model: ${ttl}`);
        updateModel(this._model.uri, ttl);
    }
}

export default new ModelDetailStore();
