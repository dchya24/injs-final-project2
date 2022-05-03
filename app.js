const express = require("express");
const app = express();
const userRoutes = require("./routes/users.routes")

require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  return  res.status(200)
    .json({
      message: "Hello World!"
    })
})

app.use("/users", userRoutes)

app.use((err, req, res, next) => {
  console.log(err)
  return res.status(500)
    .json({
      message: err.message
    })
})

app.listen(PORT, () => {
  console.log(`Server start at port ${PORT}`);
});