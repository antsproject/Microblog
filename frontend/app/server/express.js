const express = require('express');
const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter, matchPath } = require('react-router-dom');
const app = express();

const routes = require( './routes' );
const { App } = require('../src/App');

app.get(/\.(js|css|map|ico)$/, express.static(path.resolve(__dirname, '../build')));
app.use('*', (req, res) => {
    let indexHTML = fs.readFileSync(path.resolve(__dirname, '../build/index.html'), {
        encoding: 'utf8',
    });
    let appHTML = ReactDOMServer.renderToString(<App />);
    indexHTML = indexHTML.replace('<div id="app"></div>', `<div id="app">${appHTML}</div>`);
    res.contentType('text/html');
    res.status(200);
    return res.send(indexHTML);
});
app.listen('9000', () => {
    console.log('Express server started at <http://localhost:9000>');
});