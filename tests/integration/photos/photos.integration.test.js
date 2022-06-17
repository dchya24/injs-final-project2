const request = require("supertest");
const app = require("../../../app");
const { sequelize, User } = require("../../../models");
const auth = require("../../../middlewares/auth");

let token = "";
let photo = {};
let comment = {};
let user = {}

beforeAll(async () => {
    user = await User.findByPk(1);

    token = auth.generateToken({
        id: user.id,
        email: user.email,
        name: user.full_name
    });
});

describe('POST photos', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .post('/photos/')
            .set("x-access-token", token)
            .send({
                title: "lorem ipsum dolor sit amet",
                caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus viverra accumsan in nisl. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Amet dictum sit amet justo. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Turpis cursus in hac habitasse platea. Vitae tempus quam pellentesque nec nam. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Viverra vitae congue eu consequat. Lectus sit amet est placerat in egestas erat imperdiet sed. Pharetra massa massa ultricies mi quis hendrerit dolor magna eget. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Suspendisse sed nisi lacus sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.",
                poster_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                photo = res.body
                expect(res.status).toEqual(201);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("title");
                expect(res.body.title).toEqual("lorem ipsum dolor sit amet");
                expect(res.body.UserId).toEqual(user.id);
                done();
            })
    });

    it('Should send response with code 422 when req.body incomplete', (done) => {
        request(app)
            .post('/photos/')
            .set("x-access-token", token)
            .send({
                caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus viverra accumsan in nisl. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Amet dictum sit amet justo. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Turpis cursus in hac habitasse platea. Vitae tempus quam pellentesque nec nam. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Viverra vitae congue eu consequat. Lectus sit amet est placerat in egestas erat imperdiet sed. Pharetra massa massa ultricies mi quis hendrerit dolor magna eget. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Suspendisse sed nisi lacus sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.",
                poster_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(422);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("status", 'FAILED')
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toEqual('"title" is required')

                done();
            })
    });

    it('Should send response with code 402 when user dont have token', (done) => {
        request(app)
            .post('/photos/')
            .send({
                title: "lorem ipsum dolor sit amet",
                caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus viverra accumsan in nisl. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Amet dictum sit amet justo. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Turpis cursus in hac habitasse platea. Vitae tempus quam pellentesque nec nam. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Viverra vitae congue eu consequat. Lectus sit amet est placerat in egestas erat imperdiet sed. Pharetra massa massa ultricies mi quis hendrerit dolor magna eget. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Suspendisse sed nisi lacus sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.",
                poster_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(402);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Invalid Token")
                done();
            })
    });
});

describe('GET photos', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .get('/photos/')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("photos");
                expect(typeof res.body.photos).toEqual("object");
                expect(res.body.photos[0].UserId).toEqual(user.id);

                done();
            })  
    });

    it('Should return error 402 when user dont have token', (done) => {
        request(app)
            .get('/photos/')
            .end((err, res) => {
                if (err) {
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

describe('PUT photos', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .put('/photos/' + photo.id)
            .set("x-access-token", token)
            .send({
                title: "updated photo",
                caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus viverra accumsan in nisl. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Amet dictum sit amet justo. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Turpis cursus in hac habitasse platea. Vitae tempus quam pellentesque nec nam. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Viverra vitae congue eu consequat. Lectus sit amet est placerat in egestas erat imperdiet sed. Pharetra massa massa ultricies mi quis hendrerit dolor magna eget. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Suspendisse sed nisi lacus sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.",
                poster_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("photo");
                expect(typeof res.body.photo).toEqual("object");
                expect(res.body.photo.title).toEqual("updated photo")
                done();
            })
    });

    it('Should send response with code 402 when user dont have token', (done) => {
        request(app)
            .put('/photos/' + photo.id)
            .send({
                title: "updated photo",
                caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus viverra accumsan in nisl. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Amet dictum sit amet justo. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Turpis cursus in hac habitasse platea. Vitae tempus quam pellentesque nec nam. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Viverra vitae congue eu consequat. Lectus sit amet est placerat in egestas erat imperdiet sed. Pharetra massa massa ultricies mi quis hendrerit dolor magna eget. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Suspendisse sed nisi lacus sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.",
                poster_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(402);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Invalid Token")
                done();
            })
    });

    it('Should send response with code 404 when photo not found', (done) => {
        request(app)
            .put('/photos/322')
            .set("x-access-token", token)
            .send({
                title: "updated photo",
                caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus viverra accumsan in nisl. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Amet dictum sit amet justo. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Turpis cursus in hac habitasse platea. Vitae tempus quam pellentesque nec nam. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Viverra vitae congue eu consequat. Lectus sit amet est placerat in egestas erat imperdiet sed. Pharetra massa massa ultricies mi quis hendrerit dolor magna eget. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Suspendisse sed nisi lacus sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.",
                poster_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Photo not found!")
                done();
            })
    });

    it('Handle when users dont have req.body photo', (done) => {
        request(app)
            .put('/photos/322')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(422);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("status")
                expect(res.body.status).toEqual("FAILED")
                expect(res.body).toHaveProperty("message")
                done();
            })
    });
});

describe('Delete photos', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .delete('/photos/' + photo.id)
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Your photo has been successfully deleted")
                done();
            })
    });

    it('Should send response with code 404 when photo not found', (done) => {
        request(app)
            .delete('/photos/322')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Photo not found!");
                done();
            })
    });

    it('Should send response with code 402 when user dont have token', (done) => {
        request(app)
            .delete('/photos/322')
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(402);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Invalid Token")
                done();
            })
    });

    it('Should send response with code 422 when id photo not number', (done) => {
        request(app)
            .delete('/photos/322x')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                
                expect(res.status).toEqual(422);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("status", "FAILED");
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toEqual('"photoId" must be a number')
                done();
            })
    });
});

afterAll((done) => {
    sequelize.queryInterface.bulkDelete("Photo", {
        id: photo.id
    })
    .then(() => {
        done()
    })
    .catch((e) => {
        done(e);
    })
})