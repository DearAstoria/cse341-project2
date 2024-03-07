const express = require("express");
const pokemonController = require("../controllers/pokemon");
const trainersController = require("../controllers/trainers");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");
const validate = require("../middleware/validate");
const validateTrainers = require("../middleware/validateTrainers");
const passport = require("passport");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//router.get("/logout", (req, res, next) => {
//  req.logout(() => {});
//  res.redirect("/hub/login");
//});

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Successful authentication, redirect to the home page or any other route
    res.redirect("/");
  }
);

// Serve up those docs
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

// GET all trainer/feed
router.get("/trainers/", trainersController.getAllTrainers);

// GET specific pokemon using _id
router.get("/trainers/:_id", trainersController.getSpecificTrainer);

// Create a POST route to create a new contact.
router.post(
  "/trainers/",
  validateTrainers.saveContact,
  trainersController.postTrainer
);

//Create a PUT route to update a contact. This route should allow for a url
router.put(
  "/trainers/:_id",
  validateTrainers.saveContact,
  trainersController.putTrainer
);

// Create a DELETE route to delete a contact.
router.delete("/trainers/:_id", trainersController.deleteTrainer);

// GET all pokemon/feed
router.get("/", pokemonController.getAllPokemon);

// GET specific pokemon using _id
router.get("/:_id", pokemonController.getSpecificPokemon);

// Create a POST route to create a new contact.
router.post("/", validate.saveContact, pokemonController.postPokemon);

//Create a PUT route to update a contact. This route should allow for a url
router.put("/:_id", validate.saveContact, pokemonController.putPokemon);

// Create a DELETE route to delete a contact.
router.delete("/:_id", pokemonController.deletePokemon);

// localhost:8080/pokemon/
module.exports = router;
