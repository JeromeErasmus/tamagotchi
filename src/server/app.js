const os = require('os');
const express = require('express');
const Tamagotchi = require('./classes/Tamagotchi.js');

// define props
const gameInterval = 2000;
let pet = new Tamagotchi(os.userInfo().username);

// construct our Express server
const app = express();

// the is the main game loop. It uses a set interval time to update each game loop every gameInterval duration in milliseconds
const run = () => {
  setInterval(() => {
    if (pet && pet.isAlive()) {
      pet.runCycle();
    } else {
      // critter died
    }
    if(pet) {
      pet.logStats();
    }
  }, gameInterval)
}

app.get('/api/create', function (req, res) {
  pet.initNew();
  if(pet) {
    res.send(true);
  }
});

app.get('/api/feed', function (req, res) {
  res.send(pet.doFeed());
});

app.get('/api/clean', function (req, res) {
  res.send(pet.doClean());
});

app.get('/api/getstatus', function (req, res) {
  res.send(pet.getStatus());
});

// we wrap the app in a module so that it is more testable. I.e. we are excluding the listener on port 8080
module.exports = {
  app,
  run
};