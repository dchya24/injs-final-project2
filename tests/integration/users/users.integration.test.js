const request = require("supertest");
const app = require("../../../app");
const { sequelize } = require("../../../models");
const user_data = {
  full_name: 'Cahya Dinar Prastyo',
  email: 'test@test.com',
  username: 'test123',
  password: 'secret123',
  profile_image_url: 'http://www.google.com',
  age: 19,
  phone_number: '08580482'
}
let user = {
  id: {},
  token: ""
};

describe('POST users/register', () => {
  it('Should send response with code 201', (done) => {
    request(app)
      .post('/users/register')
      .send(user_data)
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("user");
        expect(res.body.user.full_name).toEqual(user_data.full_name);
        expect(res.body.user).not.toHaveProperty("password");
        user.id = res.body.user.id;
        done();
      })
  });

  it('Should send response with code 402 if email was registered', (done) => {
    request(app)
      .post('/users/register')
      .send(user_data)
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(402);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("status","Fail");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Email was registered!");
        done();
      })
  });

  it('Should send response with code 422 if req.body not completed', (done) => {
    request(app)
      .post('/users/register')
      .send({
        email: "notcompleted@test.com"
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("status");
        expect(res.body.status).toEqual("FAILED");
        expect(res.body).toHaveProperty("message");
        done();
      })
  });
});

describe('POST users/login', () => {
  it('Should send response with code 200', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: user_data.email,
        password:user_data.password
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("token");
        expect(typeof res.body.token).toEqual("string")
        user.token = res.body.token
        done();
      })
  });

  it('Should send response with code 422 when re.body not completed', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: "usernotfound@test.com"
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("status", "FAILED");
        expect(res.body).toHaveProperty("message")
        expect(res.body.message).toEqual('"password" is required')
        done();
      })
  });

  it('Should send response with code 400 when user not found', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: "usernotfound@test.com",
        password:user_data.password
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(400);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("User not found");
        done();
      })
  });

  it('Should send response with code 403 when password not valid', (done) => {
    request(app)
      .post('/users/login')
      .send({
        email: user_data.email,
        password:"wrongpassword"
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(403);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(typeof res.body.message).toEqual("string");
        expect(res.body.message).toEqual("Password not valid");
        done();
      })
  });
})

describe('PUT /users/:userId', () => {
  beforeAll(() => {
    delete user_data.password;
  });

  it('Should return response data with code 200', (done) => {
    request(app)
    .put('/users/' + user.id)
    .set("x-access-token", user.token)
    .send(user_data)
    .end((err, res) => {
      if(err){
        done(err)
      }

      expect(res.status).toEqual(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("user")
      expect(res.body.user).toHaveProperty("full_name");
      expect(res.body.user.full_name).toEqual("Cahya Dinar Prastyo")
      done();
    })
  });

  it('Should return code 401 when user have invalid token', (done) => {
    request(app)
    .put('/users/1211')
    .set("x-access-token", user.token)
    .send(user_data)
    .end((err, res) => {
      if(err){
        done(err)
      }

      expect(res.status).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toEqual("Error unauthorized")
      done();
    })
  });
  
  it('Should return code 422 when req.body not have full_name', (done) => {
    const data = user_data;
    delete data.full_name;

    request(app)
    .put('/users/1211')
    .set("x-access-token", user.token)
    .send(data)
    .end((err, res) => {
      if(err){
        done(err)
      }

      expect(res.status).toEqual(422);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("status");
      expect(res.body.status).toEqual("FAILED");
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toEqual('"full_name" is required');
      done();
    })
  });
});

describe('GET /users', () => {
  it('Should return response data with code 200', (done) => {
    request(app)
    .get('/users/')
    .set("x-access-token", user.token)
    .end((err, res) => {
      if(err){
        done(err)
      }

      console.log(res.body)
      expect(res.status).toEqual(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.full_name).toEqual("Cahya Dinar Prastyo");
      done();
    })
  });
});

describe('DELETE /users/:userId', () => {
  it('Should return response data with code 200', (done) => {
    request(app)
    .delete('/users/' + user.id)
    .set("x-access-token", user.token)
    .end((err, res) => {
      if(err){
        done(err)
      }

      expect(res.status).toEqual(200);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message")
      expect(typeof res.body.message).toEqual("string")
      expect(res.body.message).toBe("Your account has been successfully deleted")
      done();
    })
  });

  it('Should return code 401 when user set different userId', (done) => {
    request(app)
    .delete('/users/111')
    .set("x-access-token", user.token)
    .end((err, res) => {
      if(err){
        done(err)
      }

      expect(res.status).toEqual(401);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Error unauthorized");
      done();
    })
  });

  it('Should return code 401 when user dont have token', (done) => {
    request(app)
    .delete('/users/111')
    .end((err, res) => {
      if(err){
        done(err)
      }

      expect(res.status).toEqual(402);
      expect(typeof res.body).toEqual("object");
      expect(res.body).toHaveProperty("message");
      expect(typeof res.body.message).toEqual("string");
      expect(res.body.message).toEqual("Invalid Token");
      done();
    })
  });
});

afterAll((done) => {
  sequelize.queryInterface.bulkDelete('User', {
    email: user_data.email
  })
    .then(() => {
      return done()
    })
    .catch(err =>{
      done(err);
    })
})