[![Code Climate](https://codeclimate.com/github/semiotproject/wot-semdesc-helper/badges/gpa.svg)](https://codeclimate.com/github/semiotproject/wot-semdesc-helper)

In this version, we use RDFTranslator API (http://rdf-translator.appspot.com/) to convert between different semantic formats.

Available formats to generate: `JSON-LD`, `N3`, `RDF XML`.

## Installation

### Via NPM

```
sudo npm i -g grunt-cli

sudo npm i
```

### Via Docker

```
sudo docker pull semiot/wot-semdesc-helper
```

## Build

```
npm run build # compile files to ./dist dir
```

## Launching

### Via NPM

```
npm run serve # launch http server on ./dist dir
```

### Via Docker 

```
sudo docker run -i -p 3000:3000 semiot/wot-semdesc-helper
```

## Development

```
npm run dev # both of above + file watcher
```

Port 3000.

## Known issues

* Generation failes, if no URI provided
* Drivers and actuators are not supported yet
* RDFTranslator append his own artefacts on some formats, e. g. `@id` field in `JSON-LD` description might be like `file:///base/data/home/apps/s%7Erdf-translator/1.380697414950152317/${YOUR_URI}`
* No notification from RDFTranslator, if service is down
* Minor style issues
