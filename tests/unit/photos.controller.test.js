const httpMock = require("node-mocks-http");
const PhotosController = require("../../controllers/photos.controllers")
const { Photo } = require("../../models")

jest.mock("../../models");
let req, res, next;

const createPhoto = {
  "title": "Lorem ipsum dolor",
  "caption": "Doakosda asd asd asd asd asd asd as dasd asd123 fdssf sdf",
  "poster_image_url": "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200",
}
const photos = [{
  "id": 6,
  ...createPhoto,
  "UserId": 3
}]

beforeEach(() => {
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = jest.fn();
});



describe('PhotosController.getPhotos', () => {
  it("Should return 200 and return photos", async() => {
    req.userId = 3
    
    Photo.findAll.mockResolvedValue(photos);

    await PhotosController.getPhotos(req, res, next);

    expect(res.statusCode).toEqual(200);
    expect(res._getJSONData()).toHaveProperty("photos", photos)
  });

  it("Should handle errors", async() => {
    req.userId = 3;
    Photo.findAll.mockRejectedValue({ message: "Handle error getPhotos"});

    await PhotosController.getPhotos(req, res, next);
    expect(next).toHaveBeenCalled();
  })
});

describe('PhotosController.createPhoto', () => {
  it("Should return code 201 and photo", async() => {
    Photo.create.mockResolvedValue(createPhoto);

    await PhotosController.createPhoto(req, res, next);
    expect(res.statusCode).toEqual(201);
    expect(res._getJSONData()).toEqual(createPhoto);
  });

  it("Should handle errors", async() => {
    Photo.create.mockRejectedValue({ message: "Handle error createPhoto"});

    await PhotosController.createPhoto(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});