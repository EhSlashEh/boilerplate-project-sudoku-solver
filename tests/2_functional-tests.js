const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  
  // Test 1: Solve a puzzle with valid puzzle string
  test('Solve a puzzle with valid puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'solution');
        done();
      });
  });

  // Test 2: Solve a puzzle with missing puzzle string
  test('Solve a puzzle with missing puzzle string: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field missing');
        done();
      });
  });

  // Test 3: Solve a puzzle with invalid characters
  test('Solve a puzzle with invalid characters: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...X' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  // Test 4: Solve a puzzle with incorrect length
  test('Solve a puzzle with incorrect length: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2..' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  // Test 5: Solve a puzzle that cannot be solved
  test('Solve a puzzle that cannot be solved: POST request to /api/solve', (done) => {
    chai.request(server)
      .post('/api/solve')
      .send({ puzzle: '115..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Puzzle cannot be solved');
        done();
      });
  });

  // Test 6: Check a puzzle placement with all fields
  test('Check a puzzle placement with all fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9', coordinate: 'A1', value: '7' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isTrue(res.body.valid);
        done();
      });
  });

  // Test 7: Check a puzzle placement with single placement conflict
  test('Check a puzzle placement with single placement conflict: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9', coordinate: 'A1', value: '5' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.include(res.body.conflict, 'row');
        done();
      });
  });

  // Test 8: Check a puzzle placement with multiple placement conflicts
  test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9', coordinate: 'A1', value: '1' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        done();
      });
  });

  // Test 9: Check a puzzle placement with all placement conflicts
  test('Check a puzzle placement with all placement conflicts: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9', coordinate: 'A1', value: '2' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'valid');
        assert.isFalse(res.body.valid);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.include(res.body.conflict, 'row');
        assert.include(res.body.conflict, 'column');
        assert.include(res.body.conflict, 'region');
        done();
      });
  });

  // Test 10: Check a puzzle placement with missing required fields
  test('Check a puzzle placement with missing required fields: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Required field(s) missing');
        done();
      });
  });

  // Test 11: Check a puzzle placement with invalid characters
  test('Check a puzzle placement with invalid characters: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...X', coordinate: 'A1', value: '7' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid characters in puzzle');
        done();
      });
  });

  // Test 12: Check a puzzle placement with incorrect length
  test('Check a puzzle placement with incorrect length: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2..' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
        done();
      });
  });

  // Test 13: Check a puzzle placement with invalid placement coordinate
  test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9', coordinate: 'Z1', value: '7' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid coordinate');
        done();
      });
  });

  // Test 14: Check a puzzle placement with invalid placement value
  test('Check a puzzle placement with invalid placement value: POST request to /api/check', (done) => {
    chai.request(server)
      .post('/api/check')
      .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2....6.7...7...8.8..5.....1.45....8.3..2...9', coordinate: 'A1', value: '10' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isObject(res.body);
        assert.property(res.body, 'error');
        assert.equal(res.body.error, 'Invalid value');
        done();
      });
  });

});
