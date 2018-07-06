let term = require('terminal-kit').terminal;
let items = [
  'a. Refresh',
  'b. Feed critter',
  'c. Clean critter / clean poops',
  'c. Play with critter',
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
    term('\n').eraseLineAfter.red('woops...your critter has died. :/');
  } else {
    term('\n').eraseLineAfter.green('Hi! Select Create New Critter to start a new Tamagotchi critter!\n');
    term('\n').eraseLineAfter.green('Once your new critter is created you can select refresh update the screen. And also take note that your critter may fall asleep from time to time for about 5 seconds. You will not be able to control it when it is asleep.\nHave fun!\n');
  }
  term.singleColumnMenu(itemsEnd, (error, response) => {
    if(error) {
      // A critical error occured. Log output and exit.
      term.red.bold( "\nAn error occurs: " + error + "\n" ) ;
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
  term('\n').eraseLineAfter.green('You may also control the critters actions via the end points below:\n');
  term('\n').eraseLineAfter.green(server+'/api/create');
  term('\n').eraseLineAfter.green(server+'/api/feed');
  term('\n').eraseLineAfter.green(server+'/api/clean');
  term('\n').eraseLineAfter.green(server+'/api/attention');
  term('\n\n').eraseLineAfter.green('-'.repeat(80));
  term('\n').eraseLineAfter.green(
    "💛  HEALTH: %s (max %s) | 🍔   food %s (max %s)  💩  Hygene: %s (max %s) \n😀  ATTENTION: %s (max %s) \n   Age: %s\n",
    data.stats.health || 0,
    data.stats.maxHeath || 0,
    data.stats.food || 0,
    data.stats.maxFood || 0,
    data.stats.hygene || 0,
    data.stats.maxHygene || 0,
    data.stats.attention || 0,
    data.stats.maxAttention || 0,
    data.stats.age.label || '',
  );
  term('').eraseLineAfter.green('-'.repeat(80));

  if(data.stats.age && data.stats.age.data) {
    term('\n').eraseLineAfter.gray(data.stats.age.data);
    term('\n');
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
      term.red.bold( "\nAn error occurs: " + error + "\n" ) ;
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
  if(!callback) {
    return false;
  }

  term.singleColumnMenu(items, (error, response) => {
    if (!response) {
      return false;
    }
    if(error) {
      // A critical error occured. Log output and exit.
      term.red.bold( "\nAn error occurs: " + error + "\n" ) ;
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
    term('\n').eraseLineAfter.cyan('> %s', element);
  });
  term('\n');
  return true;
}

module.exports = {
  showStats,
  showMainScreen,
  showSleepScreen,
  showOptionsScreen,
  writeConsoleMessage
};
