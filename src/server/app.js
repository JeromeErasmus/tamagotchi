const os = require('os');
const express = require('express');
const Tamagotchi = require('./classes/Tamagotchi.js');

// define props
const gameInterval = 1000;
let pet = new Tamagotchi(os.userInfo().username);

// construct our Express server
const app = express();
app.use(express.static('dist'));

/**
 * the is the main game loop. 
 * It uses a set interval time to update each game loop every gameInterval duration in milliseconds
 *
 * @param  none
 */

const run = () => {
  setInterval(() => {
    if (pet && pet.isAlive()) {
      pet.runCycle();
      pet.logStats();
    } else {
      // critter died
    }
  }, gameInterval)
}

/**
 * Create a new Tamagotchi critter.
 *
 * @param  none
 * @return Json
 */
app.get('/api/create', function (req, res) {
  res.send(pet.initNew());
});

/**
 * Feeds the Tamagotchi critter.
 *
 * @param  none
 * @return Json
 */
app.get('/api/feed', function (req, res) {
  res.send(pet.doFeed());
});

/**
 * Cleans up the Tamagotchi critters poop.
 *
 * @param  none
 * @return Json
 */
app.get('/api/clean', function (req, res) {
  res.send(pet.doClean());
});

/**
 * Give the Tamagotchi critter some attention.
 *
 * @param  none
 * @return Json
 */
app.get('/api/attention', function (req, res) {
  res.send(pet.doAttention());
});

/**
 * Get status for the Tamagotchi critter.
 *
 * @param  none
 * @return Json
 */
app.get('/api/getstatus', function (req, res) {
  res.send(pet.getStatus());
});

// we wrap the app in a module so that it is more testable. I.e. we are excluding the listener on port 8080
module.exports = {
  app,
  run
};