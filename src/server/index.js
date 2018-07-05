const express = require('express');
const os = require('os');
const Tamagotchi = require('./classes/Tamagotchi.js');
// const api = require('./api/endpoints');

// construct our Express server
const app = express();
app.use(express.static('dist'));
// app.use(express.static('dist'), api);

// define props
const gameInterval = 2000;
let pet = new Tamagotchi(os.userInfo().username);


// the is the main game loop. It uses a set interval time to update each game loop every gameInterval duration in milliseconds
const runApp = () => {
  setInterval(() => { 
    if (pet.isAlive()) {
      pet.runCycle();
    } else {
      // critter died
    }
    pet.logStats();
  }, gameInterval)
}


app.get('/api/feed', function (req, res) {
  res.send(pet.doFeed());
});

app.get('/api/sleep', function (req, res) {
  res.send(pet.doSleep());
});

app.get('/api/getstatus', function (req, res) {
  res.send(pet.getStatus());
});

// app.get('/api/', function (req, res) {
//     let pet = new Tamagotchi(os.userInfo().username);
//     res.send(pet.name);
// });



app.get('/api/getUsername', (req, res) => res.send({
  username: os.userInfo().username
}));

app.listen(8080, () => runApp());