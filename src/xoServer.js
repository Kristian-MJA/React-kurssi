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
const gameRooms = [];
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

io.on('connection', (socket) => {
  const omaID = socket.id;

  console.log('Socket connected:', omaID);
  socket.emit('gameId', omaID);

  players.push({ hostId: omaID, guestId: '', state: {} });
  console.log('Pelaajat:', players.map((P) => P.hostId));

  socket.on('joinRoom', (data) => {
    const roomIndex
      = gameRooms.findIndex((R) => R.name === data.roomId);

    if (roomIndex > -1) {
      if (Object.keys(gameRooms[roomIndex].guest).length > 0) {
        socket.emit('serverMessage', 'Huone on täynnä!');
      } else {
        gameRooms[roomIndex].guest
          = { id: data.playerId, nick: data.nick };
        socket.emit(
          'serverMessage',
          `Liityit huoneeseen ${data.roomId}`
        );
        socket.to(gameRooms[roomIndex].creator)
          .emit('joinedMyRoom', data);

        console.log('Huoneet:', gameRooms);
      };
    } else {
      socket.emit('serverMessage', 'Huonetta ei löydy!');
    };
  });

  socket.on('createRoom', (data) => {
    const room = data.room;
    const index = gameRooms.findIndex((R) => R.name === room);

    if (index === -1) {
      // Huonetta ei vielä ole
      gameRooms.push({
        name: room,
        creator: socket.id,
        guest: {}
      });

      socket.join(room);
      socket.emit('serverMessage', `Huone ${room} luotu!`);
      socket.emit(
        'serverMessage',
        `Huoneet joissa olet: ${socket.rooms}`
      );

      console.log('Huoneet:', gameRooms);
    } else {
      // Huone on jo olemassa
      socket.emit('serverMessage', 'Huone on jo olemassa!');
    };
  });

  // TODO: pelidatan välitys: pelaaja 1 <--> huone <--> pelaaja 2
  socket.on('gameData', (gameState) => {
    /*
    const sender = socket.id;
    const guestIndex
      = players.findIndex((P) => P.guestId === sender);
    console.log('guestindex:', guestIndex);
    const hostIndex
      = players.findIndex((P) => P.hostId === sender);
    console.log('hostindex:', hostIndex);
    let host = '';
    let guest = '';

    if (guestIndex > -1) {
      // Olet pelin vieras
      host = players[guestIndex].hostId;
      guest = sender;
      io.to(host).emit('gameData', gameState);
    } else {
      // Olet pelin isäntä
      host = sender;
      guest = players[hostIndex].guestId;
      io.to(guest).emit('gameData', gameState);
    };
    */

    /*
    const index = players.findIndex((P) => P.hostId === socket.id);
    players[index].state = gameState;

    const host = players[index].hostId;
    const guest = players[index].guestId;

    //io.to(host).to(guest).emit('gameData', gameState);
    io.to(guest).emit('gameData', gameState);
    */

    console.log(`Vastaanottettu ID=${socket.id}:`);
    console.log(`Isäntä: ${host}, vieras: ${guest}`);
    console.log(printGameData(gameState));
  });

  socket.on('disconnect', () => {
    const playerIndex
      = players.findIndex((P) => P.hostId === socket.id);
    const roomIndex
      = gameRooms.findIndex((R) => R.creator === socket.id);

    players.splice(playerIndex, 1);
    gameRooms.splice(roomIndex, 1);

    console.log('Socket disconnected:', omaID);
    console.log('Pelaajat', players.map((P) => P.hostId));
    console.log('Huoneet:', gameRooms);
  });

});

httpServer.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}\r\n`);
});