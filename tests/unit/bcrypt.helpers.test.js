const bcrypt = require("bcrypt");
const bcryptHelper = require("../../helpers/bcrypt");

jest.mock("bcrypt")

describe("bcryptHelper test", () => {
  it("bcryptHelper.hash", () => {
    bcrypt.hashSync = jest.fn().mockImplementation(() => "123");

    const encrypted = bcryptHelper.hash("test")
    expect(encrypted).toEqual("123");
  })

  it("bcryptHelper.compareSync", () => {
    bcrypt.compareSync = jest.fn().mockImplementation(() => true);

    const encrypted = bcryptHelper.compare("test", "123")
    expect(encrypted).toEqual(true);
  })
})