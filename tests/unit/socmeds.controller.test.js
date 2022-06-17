const httpMock = require('node-mocks-http');
const SocmedController = require('../../controllers/socmed.controller');
const { SocialMedia } = require('../../models');

jest.mock('../../models');
let req, res, next;

const createSocmed = {
    dataValues: {
        "id": 1,
        "name": "Lorem ipsum dolor sit amet",
        "url": "https://www.instagram.com/",
        "UserId": 3
    }
}
const socmeds = [{
    "id": 1,
    ...createSocmed,
    "UserId": 3
}]

const updateSocmed = {
    "id": 1,
    "name": "Lorem ipsum dolor sit amet",
    "url": "https://www.instagram.com/",
    "UserId": 3
}

beforeEach(() => {
    req = httpMock.createRequest();
    res = httpMock.createResponse();
    next = jest.fn();
});

describe('SocmedController.getSocmeds', () => {
    it("Should return 200 and return socmeds", async () => {
        req.userId = 3

        SocialMedia.findAll.mockResolvedValue(socmeds);

        await SocmedController.getSocmed(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("social_medias", socmeds)
    });

    it("Should handle errors", async () => {
        req.userId = 3;
        SocialMedia.findAll.mockRejectedValue({ message: "Handle error getSocmeds" });

        await SocmedController.getSocmed(req, res, next);
        expect(next).toHaveBeenCalled();
    })
});

describe('SocmedController.createSocmed', () => {
    it("Should return code 201 and socmed", async () => {
        SocialMedia.create.mockResolvedValue(createSocmed);

        await SocmedController.createSocmed(req, res, next);

        expect(res.statusCode).toEqual(201);
        expect(res._getJSONData()).toHaveProperty("social_media", createSocmed)
    });

    it("Should handle errors", async () => {
        SocialMedia.create.mockRejectedValue({ message: "Handle error createSocmed" });

        await SocmedController.createSocmed(req, res, next);
        expect(next).toHaveBeenCalled();
    })
});

describe('SocmedController.updateSocmed', () => {
    it("Should return code 200 and socmed", async () => {
        req.userId = 3;
        req.params.socmedId = 1;
        req.body = updateSocmed;

        SocialMedia.findOne.mockResolvedValue({
            ...updateSocmed,
            save: jest.fn()
        });

        await SocmedController.updateSocmed(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("social_media", updateSocmed)
    });

    it("Should return code 404 and when sosial media not found", async () => {
        SocialMedia.findOne.mockResolvedValue(null);

        await SocmedController.updateSocmed(req, res, next);

        expect(res.statusCode).toEqual(404);
        expect(res._getJSONData()).toHaveProperty("message", "SocialMedia not found!")
    });

    it("Should handle errors", async () => {
        req.userId = 3;
        SocialMedia.findOne.mockRejectedValue({ message: "Handle error updateSocmed" });

        await SocmedController.updateSocmed(req, res, next);
        expect(next).toHaveBeenCalled();
    })
});

describe('SocmedController.deleteSocmed', () => {
    it("Should return code 200 and socmed", async () => {
        SocialMedia.destroy.mockResolvedValue(1);

        await SocmedController.deleteSocmed(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("message", "Your social media has been successfully deleted")
    });

    it("Should handle errors", async () => {
        req.userId = 3;
        SocialMedia.destroy.mockRejectedValue({ message: "Handle error deleteSocmed" });

        await SocmedController.deleteSocmed(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it("Should return code 404 and message", async () => {
        SocialMedia.destroy.mockResolvedValue(0);

        await SocmedController.deleteSocmed(req, res, next);

        expect(res.statusCode).toEqual(404);
        expect(res._getJSONData()).toHaveProperty("message", "SocialMedia not found!")
    });
});