const express = require("express");
const app = express();

require("dotenv").config();

const userRoutes = require("./routes/users.routes");
const photoRoutes = require("./routes/photos.routes");
const commentRoutes = require("./routes/comments.routes");
const socmedRoutes = require("./routes/socmed.routes");

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  return res.status(200)
    .json({
      message: "Hello World!"
    })
})

app.use("/users", userRoutes);
app.use("/photos", photoRoutes);
app.use("/comments", commentRoutes);
app.use("/socialmedias", socmedRoutes);

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

module.exports = app
