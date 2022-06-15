module.exports = {
  "development": {
    "username": process.env.DB_USERNAME || "postgres",
    "password": process.env.DB_PASSWORD || "postgres",
    "database": process.env.DB_NAME || "final_project2",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": process.env.DB_DIALECT || "postgres"
  },
  "test": {
    "username": process.env.DB_USERNAME || "postgres",
    "password": process.env.DB_PASSWORD || "postgres",
    "database": process.env.DB_TEST_NAME || "final_project2_test",
    "host": process.env.DB_HOST || "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": "qsclptcpxcufqx",
    "password": "772666034f87fdc24458b7c289b787508138db7604e36449dc98800aaab2ddd8",
    "database": "ddt2755dhqcs9s",
    "host": "ec2-44-196-223-128.compute-1.amazonaws.com",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
