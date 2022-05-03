const bcrypt = require("bcrypt");

exports.hash = (string) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(string, salt)
}

exports.compare = (data, encrypted) => {
  return bcrypt.compareSync(data, encrypted);
}