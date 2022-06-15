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
            .post('/socmeds/')
            .set("x-access-token", token)
            .send({
                name: "test",
                social_media_url: "https://www.facebook.com/test"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                socmed = res.body.socmed
                expect(res.status).toEqual(201);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("socmed");
                expect(typeof res.body.socmed).toEqual("object");
                done();
            })
    });
    it('Should send response with code 422 when params not yet', (done) => {
        request(app)
            .post('/socmeds/')
            .set("x-access-token", token)
            .send({
                socmedId: socmed.id
            })
            .end((err, res) => {
                if (err) {
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

describe('GET socmeds', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .get('/socmeds/')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("socmeds");
                expect(typeof res.body.socmeds).toEqual("object");
                done();
            })
    });

    it('Should return error 402 when user dont have token', (done) => {
        request(app)
            .get('/socmeds/')
            .end((err, res) => {
                if (err) {
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

describe('PUT socmeds', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .put('/socmeds/' + socmed.id)
            .set("x-access-token", token)
            .send({
                socmed: "updated social media"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("socmeds");
                expect(typeof res.body.socmeds).toEqual("object");
                expect(res.body.socmeds.socmed).toEqual("updated social media");
                done();
            })
    });

    it('Should send response with code 404 when socail media not found', (done) => {
        request(app)
            .put('/socmeds/322')
            .set("x-access-token", token)
            .send({
                scomed: "updated social media"
            })
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                done();
            })
    });

    it('Handle when users dont have req.body social media', (done) => {
        request(app)
            .put('/socmeds/322')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(422);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("status", 'FAILED')
                expect(res.body).toHaveProperty("message", '"social media" is required')
                done();
            })
    });
});

describe('Delete socmeds', () => {
    it('Should send response with code 200', (done) => {
        request(app)
            .delete('/socmeds/' + socmed.id)
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(200);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toEqual("Your social media has been successfully deleted")
                done();
            })
    });

    it('Should send response with code 404 when social media not found', (done) => {
        request(app)
            .delete('/socmeds/322')
            .set("x-access-token", token)
            .end((err, res) => {
                if (err) {
                    done(err)
                }

                expect(res.status).toEqual(404);
                expect(typeof res.body).toEqual("object");
                expect(res.body).toHaveProperty("message");
                expect(res.body.message).toEqual("SocialMedia not found!")
                done();
            })
    });

    it('Should send response with code 402 when user dont have token', (done) => {
        request(app)
            .delete('/socmeds/322')
            .end((err, res) => {
                if (err) {
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