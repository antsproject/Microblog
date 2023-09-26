const express = require('express');
const app = express();

// ...

// Настройка типа MIME для service-worker.js
app.get('/service-worker.js', (req, res) => {
    res.header('Content-Type', 'application/javascript');
    res.sendFile(__dirname + '/public/service-worker.js');
});

// ...

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});