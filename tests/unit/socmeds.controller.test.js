const httpMock = require('node-mocks-http');
const SocmedController = require('../../controllers/socmed.controllers');
const { Socmed } = require('../../models');

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

        Socmed.findAll.mockResolvedValue(socmeds);

        await SocmedController.getSocmeds(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("socmeds", socmeds)
    });

    it("Should handle errors", async () => {
        req.userId = 3;
        Socmed.findAll.mockRejectedValue({ message: "Handle error getSocmeds" });

        await SocmedController.getSocmeds(req, res, next);
        expect(next).toHaveBeenCalled();
    })
});

describe('SocmedController.createSocmed', () => {
    it("Should return code 201 and socmed", async () => {
        Socmed.create.mockResolvedValue(createSocmed);

        await SocmedController.createSocmed(req, res, next);

        expect(res.statusCode).toEqual(201);
        expect(res._getJSONData()).toHaveProperty("socmed", createSocmed)
    });

    it("Should handle errors", async () => {
        req.userId = 3;
        Socmed.create.mockRejectedValue({ message: "Handle error createSocmed" });

        await SocmedController.createSocmed(req, res, next);
        expect(next).toHaveBeenCalled();
    })
});

describe('SocmedController.updateSocmed', () => {
    it("Should return code 200 and socmed", async () => {
        Socmed.update.mockResolvedValue(updateSocmed);

        await SocmedController.updateSocmed(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("socmed", updateSocmed)
    });

    it("Should handle errors", async () => {
        req.userId = 3;
        Socmed.update.mockRejectedValue({ message: "Handle error updateSocmed" });

        await SocmedController.updateSocmed(req, res, next);
        expect(next).toHaveBeenCalled();
    })
});

describe('SocmedController.deleteSocmed', () => {
    it("Should return code 200 and socmed", async () => {
        Socmed.destroy.mockResolvedValue(1);

        await SocmedController.deleteSocmed(req, res, next);

        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toHaveProperty("socmed", 1)
    });

    it("Should handle errors", async () => {
        req.userId = 3;
        Socmed.destroy.mockRejectedValue({ message: "Handle error deleteSocmed" });

        await SocmedController.deleteSocmed(req, res, next);
        expect(next).toHaveBeenCalled();
    });

    it("Should return code 404 and message", async () => {
        Socmed.destroy.mockResolvedValue(0);

        await SocmedController.deleteSocmed(req, res, next);

        expect(res.statusCode).toEqual(404);
        expect(res._getJSONData()).toHaveProperty("message", "Socmed not found")
    });
});