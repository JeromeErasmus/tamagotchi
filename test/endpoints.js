const request = require('request');
const chai = require('chai');
const expect = chai.expect;
let methods = require('../src/server/app.js');
const serverUrl = 'http://localhost:8080';
let server = null;

describe('test the server endpoints', () => {

  // set up
  let url = serverUrl + "/api/getstatus";
  before(() => {
    server = methods.app.listen(8080, () => methods.run());
  });

  describe('test GET /api/getstatus', () => {
    it('returns status 200', () => {
      let url = serverUrl + "/api/getstatus";
      request(url, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
      });
    });
    it('expect isAlive to be equal to false', () => {
      request(url, (error, response, body) => {
        var jsonObj = JSON.parse(body);
        expect(jsonObj).to.have.property('isAlive').to.equal(false);
      });
    });
  });

  describe('test GET /api/create', () => {
    it('returns status 200', () => {
      let url = serverUrl + "/api/create";
      request(url, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
      });
    });
    it('returns status 200', () => {
      let url = serverUrl + "/api/create";
      request(url, (error, response, body) => {
        expect(JSON.parse(body)).to.equal(true);
      });
    });
  }); 
  
  describe('test GET /api/getstatus', () => {
    it('returns status 200', () => {
      let url = serverUrl + "/api/getstatus";
      request(url, (error, response, body) => {
        expect(response.statusCode).to.equal(200);
      });
    });

    it('expect status properties to be greater than 0 and isAlive is true', () => {
      request(url, (error, response, body) => {
        var jsonObj = JSON.parse(body);
        expect(jsonObj).to.have.property('isAlive').to.equal(true);
        expect(jsonObj.stats).to.be.a('object');
        Object.keys(jsonObj.stats).forEach(element => {
          expect(jsonObj.stats[element].to.be.greaterThan(0));
        });
      });
    });
  });

  // tear down. 
  after(() => {
    // Shut down the server 
    server.close();
  })
});