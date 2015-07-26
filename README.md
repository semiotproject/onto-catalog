[![Code Climate](https://codeclimate.com/github/semiotproject/onto-catalog/badges/gpa.svg)](https://codeclimate.com/github/semiotproject/onto-catalog)

In this version, we use RDFTranslator API (http://rdf-translator.appspot.com/) to convert between different semantic formats.

Available formats to generate: `JSON-LD`, `N3`, `RDF XML`.

## Installation

```
npm i -g grunt-cli

npm i
```

## Build

```
npm run build # compile files to ./dist dir
```

## Launching

```
npm run serve # launch http server on ./dist dir
```

## Development

```
npm run dev # both of above + file watcher
```

Port 3000.

## Known issues

* Generation failes, if no URI provided
* RDFTranslator append his own artefacts on some formats, e. g. `@id` field in `JSON-LD` description might be like `file:///base/data/home/apps/s%7Erdf-translator/1.380697414950152317/${YOUR_URI}`
* No notification from RDFTranslator, if service is down
* Minor style issues
