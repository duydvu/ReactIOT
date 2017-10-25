# React Internet of Things

An Internet of Things application using React.js and React Native.<br />
Based on Heroku's node-js-getting-started.git with some modifications (add Webpack, SASS language, etc.).

## Installation

If you have installed [Node.js](https://nodejs.org/en/) and [Git](https://git-scm.com/downloads), run the following command:
```
$ git clone https://github.com/duyisking/ReactIOT
$ cd ReactIOT
$ npm i
```

## Run on development

Use the command:
```
$ npm start
```
This will run localhost on port 3000, you can start coding with the auto-reload feature. This means that every change you made on the files within ./src will reload the server (Node.js) or the client (Webpack), you don't have to press F5 on the browser or restart the server :).

## Run on production

Use the command:
```
$ npm run build
```
This will build and generate bundle.js and other resources which you have used on development. They are built and placed at ./public/build, then push these files to the server (if you have one :V).