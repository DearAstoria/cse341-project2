const express = require("express");
const bodyParser = require("body-parser");
//const MongoClient = require("mongodb").MongoClient;
const mongodb = require("./db/connect");
const pokemonRoutes = require("./routes/pokemon");
const session = require("express-session");
const passport = require("./auth/passport");
const port = process.env.PORT || 8080;
const app = express();

const { auth, requiresAuth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get("/auth0", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

app.use(
  session({
    secret: "cookie",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  })
  .use("/", requiresAuth(), pokemonRoutes);

// Pretty much just a catch all
process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});
