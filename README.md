# Tamagotchi Nodejs app
This project was fun! It brings back so many great memories I had as a kid of playing with Tamagotchi toys and keeping the little critters alive. 

The console application is built with ES6 Nodejs with a twist. There is an Express server sitting behind the console application that it interacts with. I wanted to make the application and deployable to the cloud and allow anyone to interact with it via an API. See the API command below after the setup instructions. The primary way of interacting with the application is through the console which issues http based API requests to the Express server.  

This project was Built with Visual Studio Code.

## Installing
Pull the code from the repositiry and make sure that you checkout the master branch. All code is merged onto the master branch via pull requests only from the dev branch. 

The Express server is set up to run on: localhost:8080 Please ensure that there are no conflicting applciations running on that port.

Cd into the project root directory and issue the below commands.

Using yarn:
```sh
$ npm install yarn (brew install yarn for osx)
$ yarn install
```

# Running the Application
##### There are two steps involved in stating the application:
1) Start the server
2) Start the console application


### 1. Starting the server (Development mode)
In development mode the Express backend (Node server) is running nodemon which auto restarts the server when server side changes are effected.

Open a new terminal window and issue the below commands:

```sh
$ cd /
$ yarn server
```
Then head over to localhost:8080


### 2. Starting the console app (Production mode)
This is the console interface you will issue commands to your critter through and recieve updates to. 

Open another new terminal window and issue the below commands:
```sh
$ cd /
$ yarn console
```

# Running in production mode
Starting the server in production mode is recommended for production releases. Hot reloadign and nodemon are turned off in this mode.
```sh
$ cd /
$ yarn start
```

# API commands

### Creating a new Tamagotchi critter:

    GET /api/create

Response:
### Feeding a critter:

    GET /api/feed

Response:
### Playing with a critter:

    GET /api/attention

Response:
### Cleaning up after a critter:

    GET /api/clean

Response:
### Get status update on the critter:

    GET /api/getstatus
    