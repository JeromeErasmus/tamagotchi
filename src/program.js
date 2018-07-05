let term = require('terminal-kit').terminal;
let axios = require('axios');
let awaitingUserInput = true;
let messages = [];
const server = 'http://localhost:8080';
let items = [
  'a. Refresh',
  'b. Feed critter',
  'c. Play with critter',
  'd. Send critter to sleep'
];

terminate = () => {
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
  // if (name === 'r') {
  //   refresh();
  // }
});


setInterval(() => {
  if (awaitingUserInput) {
    refresh();
    awaitingUserInput = false;
  }
}, 100);

// show the context menu to the user
refresh = () => {
  getData();
}


getData = () => {
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
        if (response.data.isAlive) {
          term('\n').eraseLineAfter.green(
            "Health: %s (max %s) < food %s (max %s) | Hygene: %s (max %s) \nAttention: %s (max %s) | Age: %s\n",
            response.data.health || 0,
            response.data.maxHeath || 0,
            response.data.food || 0,
            response.data.maxFood || 0,
            response.data.hygene || 0,
            response.data.maxHygene || 0,
            response.data.attention || 0,
            response.data.maxAttention || 0,
            1,
          );
          writeConsoleMessage(messages);
        } else {
          term('\n').eraseLineAfter.red('woops...your critter has died. Take better care of it next time :/');
        }

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

            default:
              break;
          }

          // term('\n').eraseLineAfter.green(
          //   "#%s selected: %s (%s,%s)\n",
          //   response.selectedIndex,
          //   response.selectedText,
          //   response.x,
          //   response.y
          // );

          // awaitingUserInput = true;
        });
      }
      // console.log(response.data);
    })
    .catch((error) => {
      // handle error
      // console.log(error);
    })
}

doFeed = () => {
  term.clear();
  term.bold.cyan('Retrieving data...\n');

  axios.get(server + '/api/feed')
    .then((response) => {
      // handle success
      if (response.data.success) {
        messages = response.data.messages;
        refresh();
      }
    })
    .catch((error) => {
      // handle error
      console.log(error);
    });

}

writeConsoleMessage = (messages) => {
  messages.forEach(element => {
    term('\n').eraseLineAfter.green('> %s', element);
  });
  term('\n');
  messages = [];
}

// var progressBar , progress = 0 ;


// function doProgress()
// {
// 	// Add random progress
// 	progress += Math.random() / 10 ;
// 	progressBar.update( progress ) ;

// 	if ( progress >= 1 )
// 	{
// 		// Cleanup and exit
// 		setTimeout( function() { term( '\n' ) ; process.exit() ; } , 200 ) ;
// 	}
// 	else
// 	{
// 		setTimeout( doProgress , 100 + Math.random() * 400 ) ;
// 	}
// }


// progressBar = term.progressBar( {
// 	width: 80 ,
// 	title: 'Critter in sleep mode' ,
// 	eta: true ,
// 	percent: true
// } ) ;

// doProgress() ;

// logStats = () => {
//   console.log("----------------------");
//   console.log("HEALTH: ", '20');
// }

// awaitingUserInput = true;
// inquirer.prompt(questions).then(function (answers) {
//   awaitingUserInput = false;
//   console.log(answers);
// });



// const program = require('commander');
// const inquirer = require('inquirer');
// // Require logic.js file and extract controller functions using JS destructuring assignment
// // const { addContact, getContact } = require('./logic');
// let awaitingUserInput = false;
// program
//   .version('0.0.1')
//   .description('Contact management system');

// program
//   .command('addContact <firstame> <lastname> <phone> <email>')
//   .alias('a')
//   .description('Add a contact')
//   .action((firstname, lastname, phone, email) => {
//     console.log({firstname, lastname, phone, email});
//   });

// program
//   .command('getContact <name>')
//   .alias('r')
//   .description('Get contact')
//   .action(name => getContact(name));

//   let questions = [
//     {
//       type : "input",
//       name : "sender.email",
//       message : "Sender's email address - "
//     },
//     {
//       type : "input",
//       name : "sender.name",
//       message : "Sender's name - "
//     },
//     {
//       type : "input",
//       name : "subject",
//       message : "Subject - "
//     }
//   ];


//   setInterval(() => {
//       if(!awaitingUserInput) {
//         process.stdout.write('\033c');
//         logStats();
//     }
//   }, 2000)

//   logStats = () =>  {
//     console.log("----------------------");
//     console.log("HEALTH: ", '20');
//   }

//   awaitingUserInput = true;
//   inquirer.prompt(questions).then(function (answers) {
//     awaitingUserInput = false;
//     console.log(answers);
//   });

// program.parse(process.argv);