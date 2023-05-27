const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routers/tourRoutes");
const userRouter = require("./routers/userRoutes");
const reviewRouter = require("./routers/reviewRoutes");
const viewRouter = require("./routers/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) global middleware
// serving static files
app.use(express.static(path.join(__dirname, "public")));

// set security HTTP headers
const scriptSrcUrls = [
  "https://unpkg.com/",
  "https://tile.openstreetmap.org",
  "https://js.stripe.com",
  "https://m.stripe.network",
  "https://*.cloudflare.com",
];
const styleSrcUrls = [
  "https://unpkg.com/",
  "https://tile.openstreetmap.org",
  "https://fonts.googleapis.com/",
];
const connectSrcUrls = [
  "https://unpkg.com",
  "https://tile.openstreetmap.org",
  "https://*.stripe.com",
  "https://bundle.js:*",
  "ws://127.0.0.1:*/",
];
const fontSrcUrls = ["fonts.googleapis.com", "fonts.gstatic.com"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "data:", "blob:", "https:", "ws:"],
      baseUri: ["'self'"],
      fontSrc: ["'self'", ...fontSrcUrls],
      scriptSrc: ["'self'", "https:", "http:", "blob:", ...scriptSrcUrls],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:", "https://m.stripe.network"],
      childSrc: ["'self'", "blob:"],
      imgSrc: ["'self'", "blob:", "data:", "https:"],
      formAction: ["'self'"],
      connectSrc: [
        "'self'",
        "'unsafe-inline'",
        "data:",
        "blob:",
        ...connectSrcUrls,
      ],
      upgradeInsecureRequests: [],
    },
  })
);

// development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in one hour",
});

app.use("/api", limiter);

// body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: "10kb",
  })
);
app.use(cookieParser());
app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against XSS
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsAverage",
      "ratingsQuantity",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) routes
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

// 4) start server
module.exports = app;
