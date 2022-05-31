const request = require("supertest");
const app = require("../../../app");
const { sequelize, User, Photo } = require("../../../models");
const auth = require("../../../middlewares/auth");

let token = "";
let photo = {};
let comment = {};

beforeAll(async () => {
  const user = await User.findByPk(1);
  photo = await Photo.create({
    title: "lorem ipsum dolor sit amet",
        caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus viverra accumsan in nisl. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Amet dictum sit amet justo. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Turpis cursus in hac habitasse platea. Vitae tempus quam pellentesque nec nam. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Viverra vitae congue eu consequat. Lectus sit amet est placerat in egestas erat imperdiet sed. Pharetra massa massa ultricies mi quis hendrerit dolor magna eget. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Suspendisse sed nisi lacus sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.",
        poster_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200",
        UserId: user.id
  });

  token = auth.generateToken({
    id: user.id,
    email: user.email,
    name: user.full_name
  });
})

describe('POST comments', () => {
  it('Should send response with code 200', (done) => {
    request(app)
      .post('/comments/')
      .set("x-access-token", token)
      .send({
        comment: "Lorem comment dolot siamet",
        photoId: photo.id
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        comment = res.body.comment
        expect(res.status).toEqual(201);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("comment");
        expect(typeof res.body.comment).toEqual("object");
        done();
      })
  });

  it('Should send response with code 422 when params not yet', (done) => {
    request(app)
      .post('/comments/')
      .set("x-access-token", token)
      .send({
        photoId: photo.id
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        console.log(res.body);
        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("status", 'FAILED')
        done();
      })
  });
});

describe('GET comments', () => {
  it('Should send response with code 200', (done) => {
    request(app)
      .get('/comments/')
      .set("x-access-token", token)
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("comments");
        expect(typeof  res.body.comments).toEqual("object");
        done();
      })
  });

  it('Should return error 402 when user dont have token', (done) => {
    request(app)
      .get('/comments/')
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(402);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Invalid Token");
        done();
      })
  });
});

describe('PUT comments', () => {
  it('Should send response with code 200', (done) => {
    request(app)
      .put('/comments/' + comment.id)
      .set("x-access-token", token)
      .send({
        comment: "updated comment"
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("comments");
        expect(typeof res.body.comments).toEqual("object");
        expect(res.body.comments.comment).toEqual("updated comment")
        done();
      })
  });

  it('Should send response with code 404 when comment not found', (done) => {
    request(app)
      .put('/comments/322')
      .set("x-access-token", token)
      .send({
        comment: "updated comment"
      })
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        done();
      })
  });

  it('Handle when users dont have req.body comment', (done) => {
    request(app)
      .put('/comments/322')
      .set("x-access-token", token)
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(422);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("status", 'FAILED')
        expect(res.body).toHaveProperty("message", '"comment" is required')
        done();
      })
  });
});

describe('Delete comments', () => {
  it('Should send response with code 200', (done) => {
    request(app)
      .delete('/comments/' + comment.id)
      .set("x-access-token", token)
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(200);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Your comment has been successfully deleted")
        done();
      })
  });

  it('Should send response with code 404 when comment not found', (done) => {
    request(app)
      .delete('/comments/322')
      .set("x-access-token", token)
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(404);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Comment not found!")
        done();
      })
  });

  it('Should send response with code 402 when user dont have token', (done) => {
    request(app)
      .delete('/comments/322')
      .end((err, res) => {
        if(err){
          done(err)
        }

        expect(res.status).toEqual(402);
        expect(typeof res.body).toEqual("object");
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toEqual("Invalid Token")
        done();
      })
  });
});

afterAll((done) => {
  sequelize.queryInterface.bulkDelete('Photo',{
    id: photo.id
  })
  .then(() => {
    return sequelize.queryInterface.bulkDelete("Comment", { 
      id: comment.id
    });
  })
  .then(() =>{
    done()
  })
  .catch((e) => {
    done(e);
  })
})