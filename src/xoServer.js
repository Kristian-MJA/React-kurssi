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
const app = express();
//const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const httpServer = http.createServer(app);
const io = require('socket.io');
const PORT = 4000;
const ioServer = new io.Server(httpServer);

/*
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
*/

const gameSockets = [];
const nap = { x: "X", o: "O", tyhja: " " };

const printGameData = (data) => {
  // Tulostetaan pelin tila ilman tyhjiä ruutuja
  const pelilautaEiTyhjia =
    data.pelilauta.filter(N => N.nappula !== ' ');

  return { ...data, pelilauta: pelilautaEiTyhjia };
};

//app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/../public/index.html');
  res.send('xoServer.js kuittaa').status(200);
});

// Voidaan hakea tietty peli ID:n avulla
app.get('/:id', (req, res) => {
  const peliID = req.params.id;
  // Placeholder
});

ioServer.on('connection', (socket) => {
  const peliID = socket.id;

  console.log('Socket connected:', peliID);
  socket.emit('gameId', peliID);

  gameSockets.push({ id: peliID, state: {} });
  console.log('Aktiiviset pelit:', gameSockets.map(G => G.id));

  socket.on('gamedata', (data) => {
    const index = gameSockets.findIndex(G => G.id === socket.id);

    gameSockets[index].state = data;

    console.log(`Vastaanottettu ID=${socket.id}:`);
    console.log(printGameData(data));
  });

  socket.on('disconnect', () => {
    const index = gameSockets.findIndex(G => G.id === socket.id);
    gameSockets.splice(index, 1);

    console.log('Socket disconnected:', peliID);
    console.log('Aktiiviset pelit:', gameSockets.map(G => G.id));
  });

});

httpServer.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}\r\n`);
});

console.log(__dirname);