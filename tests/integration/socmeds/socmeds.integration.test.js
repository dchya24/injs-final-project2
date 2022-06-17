const request = require("supertest");
const app = require("../../../app");
const { sequelize, User } = require("../../../models");
const auth = require("../../../middlewares/auth");

let token = "";
let socmed = {};

beforeAll(async () => {
    const user = await User.findByPk(1);

    token = auth.generateToken({
        id: user.id,
        email: user.email,
        name: user.full_name
    });
});

describe('POST socmeds', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .post('/socialmedias/')
            .set("x-access-token", token)
            .send({
                name: "test",
                social_media_url: "https://www.facebook.com/test"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                socmed = res.body.social_media
                expect(res.status).toEqual(201);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("social_media");
                expect(typeof res.body.social_media).toEqual("object");
                expect(res.body.social_media.name).toEqual("test")
                done();
            })
    });

    it('Should send response with code 422 when params not yet', (done) => {
        request(app)
            .post('/socialmedias/')
            .set("x-access-token", token)
            .send({
                socmedId: socmed.id
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(422);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("status", 'FAILED')
                expect(res.body).toHaveProperty("message")
                expect(typeof res.body.message).toEqual("string")
                done();
            })
    });

    it('Should send response with code 402 when user not have token', (done) => {
        request(app)
            .post('/socialmedias/')
            .send({
                socmedId: socmed.id
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(402);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message")
                expect(typeof res.body.message).toEqual("string")
                expect(res.body.message).toEqual("Invalid Token")
                done();
            })
    });
});

describe('GET socmeds', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .get('/socialmedias/')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("social_medias");
                expect(typeof res.body.social_medias).toEqual("object");
                expect(res.body.social_medias[0]).toHaveProperty("User");
                done();
            })
    });

    it('Should return error 402 when user dont have token', (done) => {
        request(app)
            .get('/socialmedias/')
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

describe('PUT socmeds', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .put('/socialmedias/' + socmed.id)
            .set("x-access-token", token)
            .send({
                name: "updated social media",
                social_media_url: "https://www.facebook-update.com"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("social_media");
                expect(typeof res.body.social_media).toEqual("object");
                expect(res.body.social_media.name).toEqual("updated social media");
                done();
            })
    });

    it('Should send response with code 404 when socail media not found', (done) => {
        request(app)
            .put('/socialmedias/322')
            .set("x-access-token", token)
            .send({
                name: "updated social media",
                social_media_url: "https://www.facebook-update.com"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("SocialMedia not found!")
                done();
            })
    });

    it('Handle when users dont have token with return code 402', (done) => {
        request(app)
            .put('/socialmedias/322')
            .send({
                name: "updated social media",
                social_media_url: "https://www.facebook-update.com"
            })
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

    it('Handle when users dont have req.body social media', (done) => {
        request(app)
            .put('/socialmedias/322')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(422);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("status", 'FAILED')
                expect(res.body).toHaveProperty("message")
                expect(typeof res.body.message).toEqual("string");
                done();
            })
    });
});

describe('Delete socmeds', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .delete('/socialmedias/' + socmed.id)
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("Your social media has been successfully deleted")
                done();
            })
    });

    it('Should send response with code 422 when when params id not integer', (done) => {
        request(app)
            .delete('/socialmedias/322a')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(422);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("status", "FAILED");
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toEqual('"socmedId" must be a number')
                done();
            })
    });

    it('Should send response with code 404 when social media not found', (done) => {
        request(app)
            .delete('/socialmedias/322')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(typeof res.body.message).toEqual("string");
                expect(res.body.message).toEqual("SocialMedia not found!")
                done();
            })
    });

    it('Should send response with code 402 when user dont have token', (done) => {
        request(app)
            .delete('/socialmedias/322')
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

afterAll((done) => {
    sequelize.queryInterface.bulkDelete('SocialMedia', {
        id: socmed.id
    })
    .then(() => {
        return done()
    })
    .catch(err => {
        done(err);
    })
})