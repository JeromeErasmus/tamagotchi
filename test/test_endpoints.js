require('dotenv').config();
const request = require('request');
const chai = require('chai');
const expect = chai.expect;
const serverUrl = 'http://' + process.env.HOST + ':' + process.env.PORT;
let methods = require('../src/server/app');
let consoleApp = require('../src/program');
let server = null;

// set up
// let url = serverUrl + "/api/getstatus";
before(() => {
  server = methods.app.listen(8080, () => methods.run());
});


// test the API endpoints
describe('test the server endpoints', () => {
  describe('test GET /api/getstatus', () => {
    let url = serverUrl + "/api/getstatus";
    it('returns status 200', (done) => {
      request(url, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('expect isAlive to be equal to false', (done) => {
      request(url, (error, response, body) => {
        let jsonObj = JSON.parse(body);
        expect(jsonObj).to.have.property('isAlive').to.equal(false);
        done();
      });
    });
  });

  describe('test GET /api/create', () => {
    let url = serverUrl + "/api/create";
    it('returns status 200', (done) => {
      request(url, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });
    it('successfully create a new critter', (done) => {
      request(url, (error, response, body) => {
        expect(JSON.parse(body)).to.have.property('success').to.equal(true);
        done();
      });
    });
  });

  describe('test GET /api/getstatus', () => {
    let url = serverUrl + "/api/getstatus";
    it('returns status 200', (done) => {
      request(url, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('expect status properties to greater than 0 and isAlive is true', (done) => {
      request(url, (error, response, body) => {
        let jsonObj = JSON.parse(body);
        expect(jsonObj).to.have.property('isAlive').to.equal(true);
        done();
      });
    });
  });

  describe('test GET /api/feed', () => {
    let url = serverUrl + "/api/feed";
    it('returns status 200', (done) => {
      request(url, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('expect success to be true', (done) => {
      request(url, (error, response, body) => {
        let jsonObj = JSON.parse(body);
        expect(jsonObj).to.have.property('success').to.equal(true);
        done();
      });
    });
  });

  describe('test GET /api/clean', () => {
    let url = serverUrl + "/api/clean";
    it('returns status 200', (done) => {
      request(url, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
        done();
      });
    });

    it('expect success to be true', (done) => {
      request(url, (error, response, body) => {
        let jsonObj = JSON.parse(body);
        expect(jsonObj).to.have.property('success').to.equal(true);
        done();
      });
    });
  });
});

// test the console applciation 
describe('test console application functions', () => {
  describe('test insertIntoMsgQueue', () => {
    it('returns true after executing', () => {
      expect(consoleApp.insertIntoMsgQueue([])).to.equal(true);
      expect(consoleApp.insertIntoMsgQueue(['a', 'b'])).to.equal(true);
      expect(consoleApp.insertIntoMsgQueue()).to.equal(false);
    });
  });
  describe('test doAction', () => {
    it('returns true after executing Create', (done) => {
      consoleApp.doAction('create', '')
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
    });
    it('returns true after executing Feed', (done) => {
      consoleApp.doAction('feed', '')
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
    });
    it('returns true after executing Attention', (done) => {
      consoleApp.doAction('attention', '')
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
    });
    it('returns true after executing Clean', (done) => {
      consoleApp.doAction('clean', '')
      .then((response) => {
        expect(response.status).to.equal(200);
        done();
      })
    });
    
    it('returns false after executing non valid endpoint', (done) => {
      consoleApp.doAction('', '')
      .catch((error) => {
        expect(error.response.status).to.equal(404);
      });

      consoleApp.doAction('/someurl', '')
      .catch((error) => {
        expect(error.response.status).to.equal(404);
      })
      done();
    });
  });
});

// tear down. 
after(() => {
  // Shut down the server 
  server.close();
})