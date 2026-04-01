const express = require("express");
const router = require("./routes")
const dbConnection = require("./config/mongoose")

require("dotenv").config();

dbConnection();
const app = express();
const APP_PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use("/api", router);

if (process.env.NODE_ENV !== "test") {
  app.listen(APP_PORT, () => {
    console.log(`Server running on http://localhost:${APP_PORT}`)
  });
}

module.exports = app;