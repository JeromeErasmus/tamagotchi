let term = require('terminal-kit').terminal;
let items = [
  'a. Refresh',
  'b. Feed critter',
  'c. Clean critter / clean poops',
  'c. Play with critter',
  'd. Send critter to sleep',
];
let itemsEnd = [
  'a. Create New Critter',
  'b. Quit'
]
let itemsSleep = [
  'a. Refresh',
]

/**
 * Elegantly exit the application
 *
 */
const terminate = () => {
  term.clear();
  term.grabInput(false);
  setTimeout(() => {
    process.exit()
  }, 100);
}

/**
 * Shortcut key handler
 *
 */
term.on('key', (name, matches, data) => {
  if (name === 'CTRL_C') {
    terminate();
  }
});


/**
 * Update the console with the options menu
 *
 * @param state     String
 * @param callback  Function
 * @return Boolean
 */
const showMainScreen = (state, callback) => {
  if(!callback) {
    return false;
  }

  if(state && state  === 'end') {
    writeLine('\n', 'red', 'woops...your critter has died. :/');
  } else {
    writeLine('\n', 'green', 'Hi! Select Create New Critter to start a new Tamagotchi critter!\n');
    writeLine('\n', 'green', 'Once your new critter is created you can select refresh update the screen. And also take note that your critter may fall asleep from time to time for about 5 seconds. You will not be able to control it when it is asleep.\nHave fun!\n');
  }
  term.singleColumnMenu(itemsEnd, (error, response) => {
    if(error) {
      // A critical error occured. Log output and exit.
      writeLine('\n', 'red', "\nAn error occurs: " + error + "\n");
      terminate();
    }
    switch (response.selectedIndex) {
      case 0:
        callback('create', 'Creating new critter...\n');
        break;
      case 1:
        terminate();
        break;
      default:
        break;
    }
  });
}

/**
 * Update the console with the options menu
 *
 * @param  data    Object
 * @param  server  String
 * @return Boolean
 */
const showStats = (data, server) => {
  if(!data || !server) {
    return false;
  }
  writeLine('\n', 'green', 'You may also control the critters actions via the end points below:\n');
  writeLine('\n', 'green', server+'/api/create');
  writeLine('\n', 'green', server+'/api/feed');
  writeLine('\n', 'green', server+'/api/clean');
  writeLine('\n', 'green', server+'/api/attention');
  writeLine('\n', 'green', '-'.repeat(80));
  let statsData  = `💛  HEALTH: ${data.stats.health || 0} (max ${data.stats.maxHeath || 0}) |  🍔   Food: ${data.stats.food || 0} (max ${data.stats.maxFood || 0})  |  💩  Hygene: ${data.stats.hygene || 0} (max ${data.stats.maxHygene || 0})  \n😀  ATTENTION: ${data.stats.attention || 0} (max ${data.stats.maxAttention || 0})   \nAge: ${data.stats.age.label || ''}\n`;
  writeLine('\n', 'green', statsData);
  writeLine('', 'green', '-'.repeat(80));

  if(data.stats.age && data.stats.age.data) {
    writeLine('\n', 'gray', data.stats.age.data);
    writeLine('\n', '', '');
  }
}

/**
 * Update the console with the options menu
 *
 * @param callback  Function
 * @return Boolean
 */
const showSleepScreen = (callback) => {
  if(!callback) {
    return false;
  }

  term.singleColumnMenu(itemsSleep, (error, response) => {
    if (!response) {
      return false;
    }
    if(error) {
      // A critical error occured. Log output and exit.
      writeLine('', 'red', "\nAn error occurs: " + error + "\n");
      terminate();
    }
    switch (response.selectedIndex) {
      case 0:
        callback('getstatus');
        break;
      default:
        break;
    }
  });
  return true;
}

/**
 * Update the console with the options menu
 *
 * @param callback  Function
 * @return Boolean
 */
const showOptionsScreen = (callback) => {
  if(!callback || process.env.ENV === 'test' ) {
    return false;
  }

  term.singleColumnMenu(items, (error, response) => {
    if (!response) {
      return false;
    }
    if(error) {
      // A critical error occured. Log output and exit.
      writeLine('', 'red', "\nAn error occurs: " + error + "\n");
      terminate();
    }
    switch (response.selectedIndex) {
      case 0:
        callback('getstatus');
        break;
      case 1:
        callback('feed');
        break;
      case 2:
        callback('clean');
        break;
      case 3:
        callback('attention');
        break;
      case 4:
        callback('sleep');
        break;
      default:
        break;
    }
  });
}


/**
 * Update the console with the message queue
 *
 * @param  messages  Array
 * @return Boolean
 */
const writeConsoleMessage = (messages) => {
  if(!messages) {
    return false;
  }
  messages.forEach(element => {
    writeLine('\n', 'cyan', `> ${element}`);
  });
  term('\n');
  return true;
}

const writeLine = (a, col, msg) => {
  if(process.env.ENV !== 'test') {
    switch (col) {
      case 'green':
      term(a).eraseLineAfter.green(msg);
        break;
      case 'gray':
      term(a).eraseLineAfter.gray(msg);
        break;
      case 'cyan':
      term(a).eraseLineAfter.cyan(msg);
        break;
      case 'red':
      term(a).eraseLineAfter.red(msg);
        break;
      default:
        term(a).eraseLineAfter.gray(msg);
        break;
    }
    return true;
  } else {
    return false;
  }
}

module.exports = {
  showStats,
  showMainScreen,
  showSleepScreen,
  showOptionsScreen,
  writeConsoleMessage,
  writeLine
};
