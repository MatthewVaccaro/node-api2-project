//Imports
const express = require("express");
const db = require("./data/db");
const postsRouter = require("./router/posts-router");
//Server Boiler Plate
const server = express();
const port = 8080;
server.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
server.use(express.json());

//Sub Route
server.use("/api/posts", postsRouter);

//Sanitiy Checked (Confirmed)
server.get("/", (req, res) => {
  res.json({ message: "Hello world!" });
});
