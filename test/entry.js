describe('uptime', function(){
  it('should respond to GET',function(done){
    superagent
      .get('http://localhost:'+port)
      .end(function(res){
        expect(res.status).to.equal(200);
        done();
    })
  })

describe('api', function() {
  describe('GET /api/users', function() {
    it('respond with an array of users', function() {
      // ...
    });
  });
});

describe('app', function() {
  describe('GET /users', function() {
    it('respond with an array of users', function() {
      // ...
    });
  });
});

describe('api', function() {
  describe('GET /login', function() {
    it('respond with an array of users', function() {
      // ...
    });
  });
});

describe('api', function() {
  describe('GET /api/roles', function() {
    it('respond with an array of users', function() {
      // ...
    });
  });
});
