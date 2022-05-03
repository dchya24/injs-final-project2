const httpMock = require("node-mocks-http");
const jwt = require("jsonwebtoken");
const auth = require("../../middlewares/auth")

jest.mock("jsonwebtoken");

let data = {
  "id": 12,
  "email": "test@test.com",
  "password": "123456"
}

beforeEach(() => {
  req = httpMock.createRequest();
  res = httpMock.createResponse();
  next = jest.fn();
});

describe('auth.verify', () => {
  it('Should call next function', () => {
    jwt.verify = jest.fn()
      .mockImplementation(
        (token, SECRET_KEY, cb) => {
          cb(null, data)
      })

    auth.verify(req, res, next);
    expect(next).toHaveBeenCalled();
  })

  it("Should Handle Errors", () => {
    jwt.verify = jest.fn()
      .mockImplementation(
        (token, SECRET_KEY, cb) => {
          cb({ message: "Error authentication"}, null)
      });

    auth.verify(req, res, next);
    expect(res._getJSONData()).toHaveProperty("message", "Invalid Token");
    expect(res.statusCode).toEqual(402);
  });
});

describe('generateToken function', () => {
  it('should return token', () => {
    token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoiSm9obiBEb2UifQ.O3qHiMQqWsJlVafdDLHMJvg--7JuNPoqReuO-j3G9Kk"
    jwt.sign.mockImplementation(() => token)
    auth.generateToken({
      "id": "1",
      "name": "John Doe"
    })

    expect(jwt.sign).toHaveBeenCalled();
    expect(jwt.sign).toHaveReturnedWith(token);
  });
});