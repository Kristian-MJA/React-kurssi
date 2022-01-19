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
const http = require('http');
const httpServer = http.createServer(app);
const io = require('socket.io');
const PORT = 5000;
const ioServer = new io.Server(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Listening on localhost: ${PORT}\r\n`);
});