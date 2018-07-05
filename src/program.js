let term = require('terminal-kit').terminal;
let axios = require('axios');
// let awaitingUserInput = true;
let messages = [];
const server = 'http://localhost:8080';

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

const terminate = () => {
  term.clear();
  term.grabInput(false);
  setTimeout(() => {
    process.exit()
  }, 100);
}

term.on('key', (name, matches, data) => {
  if (name === 'CTRL_C') {
    terminate();
  }
});

const getData = () => {
  term.clear();
  term.bold.cyan('Retrieving data...\n');

  axios.get(server + '/api/getstatus')
    .then((response) => {
      // handle success
      if (response && response.data) {
        
        term.clear();
        term.bold.gray('Choose from one of the following actions below...\n');
        term.green('Hit CTRL-C to quit.\n');
        // term.green('Hit R to refresh.\n\n');
        showStats(response.data);
        writeConsoleMessage();
        
        if (!response.data.isAlive) {
          // check is alive
          showMainScreen('end');
          return false;
        } else if (response.data.sleep.status === true) {
          // check is sleeping
          showSleepScreen();
          return false;
        } else {
          // show options
          showOptionsScreen();
        }
      }
    })
    .catch((error) => {
      // handle error
      // console.log(error);
    })
}

const showStats = (data) => {
  insertIntoMsgQueue(data.messages);
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

const showMainScreen = (state) => {
  if(state && state  === 'end') {
    term('\n').eraseLineAfter.red('woops...your critter has died. :/');
  } else {
    term('\n').eraseLineAfter.green('Hi! Select Create New Critter to start a new Tamagotchi critter!\n');
    term('\n').eraseLineAfter.green('Once your new critter is created you can select refresh update the screen. And also take note that your critter may fall asleep from time to time for about 5 seconds. You will not be able to control it when it is asleep.\nHave fun!\n');
  }
  term.singleColumnMenu(itemsEnd, function (error, response) {
    switch (response.selectedIndex) {
      case 0:
        doAction('create', 'Creating new critter...\n');
        break;
      case 1:
        terminate();
        break;
      default:
        break;
    }
  });
}

const showSleepScreen = () => {
  term.singleColumnMenu(itemsSleep, function (error, response) {
    if (!response) {
      return false;
    }
    switch (response.selectedIndex) {
      case 0:
        refresh();
        break;
      default:
        break;
    }
  });
}

const showOptionsScreen = () => {
  term.singleColumnMenu(items, function (error, response) {
    if (!response) {
      return false;
    }
    switch (response.selectedIndex) {
      case 0:
        refresh();
        break;
      case 1:
        doAction('feed');
        break;
      case 2:
        doAction('clean');
        break;
      case 3:
        doAction('attention');
        break;
      default:
        break;
    }
  });
}

const doAction = (action, msg) => {
  term.clear();
  if(msg) {
    term.bold.cyan(msg);
  }
  axios.get(server + '/api/'+action)
    .then((response) => {
      // handle success
      insertIntoMsgQueue(response.data.messages);
      refresh();
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });
}

const insertIntoMsgQueue = (data) => {
  data.forEach(element => {
    messages.push(element);
  });
}

const writeConsoleMessage = () => {
  messages.forEach(element => {
    term('\n').eraseLineAfter.cyan('> %s', element);
  });
  term('\n');
  messages = [];
}

// show the context menu to the user
const refresh = () => {
  getData();
}

showMainScreen();
