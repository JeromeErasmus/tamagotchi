let term = require('terminal-kit').terminal;
let axios = require('axios');
let awaitingUserInput = true;
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


const intervalId = setInterval(() => {
  if (awaitingUserInput) {
    refresh();
    awaitingUserInput = false;
  }
}, 100);

// show the context menu to the user
const refresh = () => {
  getData();
}


const getData = () => {
  term.clear();
  term.bold.cyan('Retrieving data...\n');

  axios.get(server + '/api/getstatus')
    .then((response) => {
      // handle success
      if (response && response.data) {
        term.clear();
        term.bold.cyan('Choose from one of the following actions below...\n');
        term.green('Hit CTRL-C to quit.\n');
        // term.green('Hit R to refresh.\n\n');
        showStats(response.data);
        writeConsoleMessage();
        
        if (!response.data.isAlive) {
          // check is alive
          showEndScreen();
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
  term('\n').eraseLineAfter.green(
    "Health: %s (max %s) < food %s (max %s) | Hygene: %s (max %s) \nAttention: %s (max %s) | Age: %s\n",
    data.stats.health || 0,
    data.stats.maxHeath || 0,
    data.stats.food || 0,
    data.stats.maxFood || 0,
    data.stats.hygene || 0,
    data.stats.maxHygene || 0,
    data.stats.attention || 0,
    data.stats.maxAttention || 0,
    1,
  );
}

const showEndScreen = () => {
  term('\n').eraseLineAfter.red('woops...your critter has died. Take better care of it next time :/');
  term.singleColumnMenu(itemsEnd, function (error, response) {
    switch (response.selectedIndex) {
      case 0:
        doCreate();
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
        doFeed();
        break;
      case 2:
        doClean();
        break;
      default:
        break;
    }
  });
}

const doCreate = () => {
  term.clear();
  term.bold.cyan('Creating new critter...\n');

  axios.get(server + '/api/create')
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

const doFeed = () => {
  term.clear();
  term.bold.cyan('Retrieving data...\n');

  axios.get(server + '/api/feed')
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

const doClean = () => {
  term.clear();
  term.bold.cyan('Retrieving data...\n');

  axios.get(server + '/api/clean')
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
    term('\n').eraseLineAfter.green('> %s', element);
  });
  term('\n');
  messages = [];
}
