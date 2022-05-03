const httpMock = require("node-mocks-http");
const UserController = require("../../controllers/users.controller");
const { User } = require("../../models")
const bcryptHelper = require("../../helpers/bcrypt");

jest.mock("../../models");
let req, res, next;

let data = {
  email: "test@test.com",
  password: "123456"
}

beforeEach(() => {
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = jest.fn();
});

describe("UserController.login", () => {
  it("Should return code 200 when success login", async () => {
    bcryptHelper.compare = jest.fn().mockImplementation(() => true)

    User.findOne.mockResolvedValue(data);

    await UserController.login(req, res, next);
    expect(res._getJSONData()).toHaveProperty("token")
    expect(res.statusCode).toEqual(200);
  })

  it("Should return code 400 when user not found", async () => {
    bcryptHelper.compare = jest.fn().mockImplementation(() => true)

    User.findOne.mockResolvedValue(null);

    await UserController.login(req, res, next);
    expect(res._getJSONData()).toHaveProperty("message", "User not found")
    expect(res.statusCode).toEqual(400);
  })

  it("Should return code 403 when password not valid", async () => {
    bcryptHelper.compare = jest.fn().mockImplementation(() => false)

    User.findOne.mockResolvedValue(data);

    await UserController.login(req, res, next);
    expect(res._getJSONData()).toHaveProperty("message", "Password not valid")
    expect(res.statusCode).toEqual(403);
  })

  it("Should handle error", async () => {
    bcryptHelper.compare = jest.fn().mockImplementation(() => false)

    User.findOne.mockRejectedValue({ message: "Error Message"});

    await UserController.login(req, res, next);
    expect(next).toHaveBeenCalled();
  })
});

describe("UserController.register", () => {
  it("Should return code 201 when success register", async() => {
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue(data)
    bcryptHelper.hash = jest.fn().mockImplementation(() => "!23")

    await UserController.register(req, res, next);
    expect(res._getJSONData()).toHaveProperty("user")
    expect(res.statusCode).toEqual(201);
  })

  it("Should return code 402 when email was registered", async() => {
    User.findOne.mockResolvedValue(data)

    await UserController.register(req, res, next);
    expect(res._getJSONData()).toHaveProperty("status", "Fail")
    expect(res._getJSONData()).toHaveProperty("message", "Email was registered!")
    expect(res.statusCode).toEqual(402);
  })

  it("Should return code 402 when email was registered", async() => {
    User.findOne.mockRejectedValue({ message: "Error pada sistem"})

    await UserController.register(req, res, next);
    expect(next).toHaveBeenCalled();
  })
})