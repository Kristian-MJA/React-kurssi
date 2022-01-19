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

*/

const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const SocketIO = require('socket.io');
const PORT = 4004;
const sioServer = new SocketIO.Server(httpServer);