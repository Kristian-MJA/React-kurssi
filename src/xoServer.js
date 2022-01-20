/*
***************************************
*   Kristian Asti                     *
*   Full Stack 2021-22                *
*   19.1.2022                         *
*                                     *
*   socket.io-palvelin ristinollaan   *
*                                     *
***************************************

https://socket.io/get-started/chat

Testi
*/

const express = require('express');
//import express from 'express';
const app = express();
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const httpServer = http.createServer(app);
const io = require('socket.io');
const PORT = 4000;
const ioServer = new io.Server(httpServer);

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  optionSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: [
    'request',
    'content-type',
    'host',
    'connection',
    'accept',
    'origin',
    'referer',
    'authorization'
  ]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/../public/index.html');
  res.redirect('http://localhost:3000');
});

ioServer.on('connection', (socket) => {

});

httpServer.listen(PORT, () => {
  console.log(`Listening on localhost: ${PORT}\r\n`);
});

console.log(__dirname);