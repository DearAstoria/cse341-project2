const express = require("express");
const bodyParser = require("body-parser");
//const MongoClient = require("mongodb").MongoClient;
const mongodb = require("./db/connect");
const pokemonRoutes = require("./routes/pokemon");
const session = require("express-session");
const passport = require("./auth/passport");
const port = process.env.PORT || 8080;
const app = express();

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
  .use("/", pokemonRoutes);

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
