const express = require("express");
const https = require("https");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const cacheControl = require("express-cache-controller");
const morgan = require("morgan");
const { check, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const app = express();

//Middleware
app.use(express.json());
// Static files
app.use(express.static("public"));
app.use(cors());
app.use(cookieParser());
app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(cacheControl({ noCache: true }));

//Morgan
morgan.token("date", function () {
  var p = new Date()
    .toString()
    .replace(/[A-Z]{3}\+/, "+")
    .split(" ");
  return p[2] + "/" + p[1] + "/" + p[3] + ":" + p[4] + " " + p[5];
});

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  })
);

// Validator
app.post(
  "/user",
  [check("username").isEmail(), check("password").isLength({ min: 5 })],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.send("User Created");
  }
);

// Session Middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

app.get("/", (req, res) => {
  console.log("Hello World");
  res.send("Hello World");
  res.cacheControl = {
    noCache: true,
  };
});
// Middleware  Chaining
app.use((req, res, next) => {
  console.log("Middleware 1");
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Route handling middleware
app.use(
  "/user/:id",
  (req, res, next) => {
    console.log("Request URL:", req.originalUrl);
    next();
  },
  (req, res, next) => {
    console.log("Request Type:", req.method);
    next();
  }
);

app.use((req, res, next) => {
  console.log("Middleware 2");
  next();
});

const Middleware = (req, res, next) => {
  console.log("Middleware");
  next();
};

app.use(Middleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
