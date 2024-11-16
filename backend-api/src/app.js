const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const JSend = require("./jsend");
const restaurantRouter = require("./routes/restaurant.router");
const dishesRouter = require("./routes/dishes.router");
const userRouter = require("./routes/user.router");

const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");
const { specs, swaggerUi } = require("./docs/swagger");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173", // frontend chạy ở cổng 5173
    credentials: true, // nếu bạn cần gửi cookie
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//SECTION - Endpoint
app.get("/", (req, res) => {
  return res.json(JSend.success());
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/public", express.static("public"));

restaurantRouter.setup(app);
dishesRouter.setup(app);
userRouter.setup(app);

app.use(resourceNotFound);
app.use(handleError);

module.exports = app;
