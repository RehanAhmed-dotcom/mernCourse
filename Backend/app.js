const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv/config");
const productsRouter = require("./routers/products");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
const categoriesRouter = require("./routers/categories");
const api = process.env.API_URL;

app.use(cors());
app.options("*", cors());

//middlware
app.use(bodyParser.json());
app.use(morgan("tiny"));

//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/categories`, categoriesRouter);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("connection is ready");
  })
  .catch((err) => {
    console.log("err", err);
  });

app.listen(3000, () => {
  console.log("api", api);
  console.log("server is running https://localhost:3000");
});
