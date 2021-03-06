require('dotenv').config();
let term = require('terminal-kit').terminal;
let axios = require('axios');
let display = require('./classes/display');
let messages = [];
const server = 'http://'+process.env.HOST+':'+process.env.PORT;

/**
 * Performs GET actions on the API
 *
 * @param  action String 
 * @param  msg    String 
 * @return Boolean
 */
const doAction = (action, msg) => {
  term.clear();
  if (msg) {
    display.writeLine('', 'cyan', msg);
  }
  return axios.get(server + '/api/' + action)
    .then((response) => {
      if(action === 'getstatus') {
        update(response.data);
      } else {
        insertIntoMsgQueue(response.data.messages);
        doAction('getstatus');
      }
      return Promise.resolve(response);
    })
    .catch((error) => {
      // If there is an operational error or programming error lets catch it here. 
      // Asyncronous errors from nodejs will be passed back up to here by callback. 
      if (error.response) {
        // The request was made and the server responded with a bad status code
        // console.log(error.response.status);
        // console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
      }
      return Promise.reject(error);
      // throw new Error(error);
    });
}

/**
 * Performs the main console update logic
 *
 * @param  data Object 
 * @return Boolean
 */
const update = (data) => {
  if(!data) {
    return false;
  }
  term.clear();
  display.writeLine('', 'gray', 'Choose from one of the following actions below...\n');
  display.writeLine('', 'green', 'Hit CTRL-C to quit.\n');
  if (data.messages) {
    insertIntoMsgQueue(data.messages);
  }
  display.showStats(data, server);

  if(display.writeConsoleMessage(messages)) {
    messages = [];
  }
  if (!data.isAlive || (data.stats.stageIndex >= data.stats.maxStages)) {
    // check is alive
    display.showMainScreen('end', doAction);
    return false;
  } else if (data.sleep.status === true) {
    // check is sleeping
    display.showSleepScreen(doAction);
    return false;
  } else {
    // show options
    display.showOptionsScreen(doAction);
  }
  return true;
}

/**
 * Update the message queue
 *
 * @param  data Array 
 * @return Boolean
 */
const insertIntoMsgQueue = (data) => {
  if(!data) {
    return false;
  }
  data.forEach(element => {
    messages.push(element);
  });
  return true;
}

display.showMainScreen('', doAction);

// we wrap the app in a module so that it is more testable. I.e. we are excluding the listener on port 8080
module.exports = {
  doAction,
  insertIntoMsgQueue,
};