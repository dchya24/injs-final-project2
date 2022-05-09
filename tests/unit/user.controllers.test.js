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

let createUser = {
  dataValues: {
    email: "test@test.com",
    password: "123456",
    full_name: "Cahya Dinar P",
    username: "test12",
    profile_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200",
    age: 19,
    phone_number: "0123132"
  }
}

const updateUser = {
  dataValues: {
    "email": "test22@test.com",
    "full_name": "Cahya Dinar P",
    "username": "test12",
    "profile_image_url": "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200",
    "age": 19,
    "phone_number": "0123132"
  }
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
    expect(res._getJSONData()).toHaveProperty("token");
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

    User.findOne.mockRejectedValue({ message: "Error Pada Login"});

    await UserController.login(req, res, next);
    expect(next).toHaveBeenCalled();
  })
});

describe("UserController.register", () => {
  it("Should return code 201 when success register", async() => {
    User.findOne.mockResolvedValue(null)
    User.create.mockResolvedValue(createUser)
    const hooks = {
      afterCreate: jest.fn()
    }
    User.options = {
      hooks: hooks
    }
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
    User.findOne.mockRejectedValue({ message: "Error saat register"})

    await UserController.register(req, res, next);
    expect(next).toHaveBeenCalled();
  })
})

describe('UserController.updateUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it("Should return 200 when success update user", async() => {
    req.userId = 1;
    req.params.userId = 1;
    const userInstance = {
      update: jest.fn(),
      save: jest.fn()
    }
    User.findOne.mockResolvedValue({
      ...updateUser,
      ...userInstance
    });
    User.update.mockResolvedValue(data);

    await UserController.updateUser(req, res, next);
    expect(res.statusCode).toEqual(200);
  });

  it("Should return 401 when access different id", async() => {
    req.userId = 1;
    req.params.userId = 2;
    await UserController.updateUser(req, res, next);
    expect(res.statusCode).toEqual(401);
    expect(res._getJSONData()).toHaveProperty("message", "Error unauthorized")
  });

  it("Should return 400 when user not found", async() => {
    req.userId = 1;
    req.params.userId = 1;
    User.findOne.mockResolvedValue(null);
    await UserController.updateUser(req, res, next);
    expect(res.statusCode).toEqual(400);
    expect(res._getJSONData()).toHaveProperty("message", "User not found")
  });
  
  it("Should handle errors", async() => {
    User.findOne.mockRejectedValue({ message: "Error saat update user"})

    await UserController.updateUser(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});

describe('UserController.deleteUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it("Should return 200 when success delete user", async() => {
    req.userId = 1;
    req.params.userId = 1;

    User.destroy.mockResolvedValue(true);

    await UserController.deleteUser(req, res, next);
    expect(res.statusCode).toEqual(200);
  });

  it("Should return 401 when success delete user", async() => {
    req.userId = 1;
    req.params.userId = 1;


    await UserController.deleteUser(req, res, next);
    expect(res.statusCode).toEqual(200);
  });

  it("Should return 401 when access different id", async() => {
    req.userId = 1;
    req.params.userId = 2;
    await UserController.deleteUser(req, res, next);
    expect(res.statusCode).toEqual(401);
    expect(res._getJSONData()).toHaveProperty("message", "Error unauthorized")
  });

  it("Should handle errors", async() => {
    User.destroy.mockRejectedValue({ message: "Error saat update user"})

    await UserController.deleteUser(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});