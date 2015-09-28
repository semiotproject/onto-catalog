"use strict";

import React from 'react';

export default class About extends React.Component {

    constructor(props) {
        super(props);

        // instead of getInitialState in new React notation
        this.state = {

        };
    }

    render() {
        return (
            <div className="app-wrapper">
                <div className="container fluid">
                    <h3>About</h3>
                    <p>
                        This is an alpha version of Web of Things Semantic Description Helper. It is online-based tool for generating semantic-enriched descriptions for sensing devices. Create device models and instances descriptions, download it in JSON-LD, RDF\XML or Turtle formats and share them with other developers.
                    </p>
                    <p>
                        This tool uses Fuseki SPARQL Endpoint underneath and a set of ontologies: <a href="http://www.w3.org/2005/Incubator/ssn/">SSN</a>, <a href="http://www.qudt.org/">QUDT</a>, <a href="http://sws.geonames.org/">GeoNames</a>. The application source code is open-source and available on <a href="https://github.com/semiotproject/wot-semdesc-helper">GitHub</a>.
                    </p>
                    <p>
                        WoT SemDesc Helper was originally developed as a poster demo for <a href="http://2015.kesw.ru/">2015 KESW conference</a> by a command of <a href="http://semiot.ru">SemIoT project</a>. Stay tuned!
                    </p>
                    <h3>Current limitations and known issues</h3>
                    <p>
                        <ul>
                            <li>Device instance view is currentrly in progress</li>
                            <li>A set of fields is under discussion</li>
                        </ul>
                    </p>
                    <p style={{textAlign: "center"}}>&copy; SemIoT Project, 2015</p>
                </div>
            </div>
        );
    }
}