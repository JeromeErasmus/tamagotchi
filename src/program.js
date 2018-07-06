let term = require('terminal-kit').terminal;
let axios = require('axios');
let display = require('./classes/display');
// let awaitingUserInput = true;
let messages = [];
const server = 'http://localhost:8080';

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
    term.bold.cyan(msg);
  }
  axios.get(server + '/api/' + action)
    .then((response) => {
      if(action === 'getstatus') {
        update(response.data);
      } else {
        insertIntoMsgQueue(response.data.messages);
        doAction('getstatus');
      }
    })
    .catch((error) => {
      console.log(error);
    });
  return true;
}

/**
 * Performs the main console update logic
 *
 * @param  data Object 
 * @return Boolean
 */
const update = (data) => {
  term.clear();
  term.bold.gray('Choose from one of the following actions below...\n');
  term.green('Hit CTRL-C to quit.\n');
  if (data.messages) {
    insertIntoMsgQueue(data.messages);
  }
  display.showStats(data, server);

  if(display.writeConsoleMessage(messages)) {
    messages = [];
  }

  if (!data.isAlive) {
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
  data.forEach(element => {
    messages.push(element);
  });
  return true;
}

display.showMainScreen('', doAction);