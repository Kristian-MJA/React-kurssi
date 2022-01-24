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
//const bodyParser = require('body-parser');
const httpServer = http.createServer(app);
const socketIo = require('socket.io');
const PORT = 4000;
const io = new socketIo.Server(httpServer);

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

const players = [];
const games = [];
const nap = { x: "X", o: "O", tyhja: " " };

const printGameData = (data) => {
  // Tulostetaan pelin tila ilman tyhjiä ruutuja
  const pelilautaEiTyhjia =
    data.pelilauta.filter((N) => N.nappula !== nap.tyhja);

  return { ...data, pelilauta: pelilautaEiTyhjia };
};

//app.use(cors(corsOptions));
//app.use(express.json());
//app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  //res.sendFile(__dirname + '/../public/index.html');
  res.send('xoServer.js kuittaa').status(200);
});

// Voidaan hakea tietty peli ID:n avulla
app.get('/:id', (req, res) => {
  const omaID = req.params.id;
  // Placeholder
});

io.on('connection', (socket) => {
  const omaID = socket.id;

  console.log('Socket connected:', omaID);
  socket.emit('gameId', omaID);

  players.push({ hostId: omaID, guestId: '', state: {} });
  console.log('Pelaajat', players.map((P) => P.hostId));

  socket.on('joinRoom', (data) => {
    const index = players
      .findIndex((P) => P.hostId === data.roomId);

    if (index > -1) {
      players[index].guestId = data.myId;
      socket.join(data.roomId);

      socket.emit(
        'serverMessage',
        `Olet liittynyt huoneeseen ${data.roomId}.`);
      socket.to(data.roomId).emit('joinedMyRoom', data);
    } else {
      socket.emit('serverMessage', 'Huonetta ei löydy!');
    };
  });

  socket.on('gameData', (gameState) => {
    const index = players.findIndex((P) => P.hostId === socket.id);
    players[index].state = gameState;

    const host = players[index].hostId;
    const guest = players[index].guestId;

    //io.to(host).to(guest).emit('gameData', gameState);
    io.to(guest).emit('gameData', gameState);

    console.log(`Vastaanottettu ID=${socket.id}:`);
    console.log(`Isäntä: ${host}, vieras: ${guest}`);
    console.log(printGameData(gameState));
  });

  socket.on('disconnect', () => {
    const index = players.findIndex((P) => P.hostId === socket.id);
    players.splice(index, 1);

    console.log('Socket disconnected:', omaID);
    console.log('Pelaajat', players.map((P) => P.hostId));
  });

});

httpServer.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}\r\n`);
});

console.log(__dirname);