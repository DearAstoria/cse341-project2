const express = require("express");
const pokemonController = require("../controllers/pokemon");
const router = express.Router();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

// Serve up those docs
router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

// GET all pokemon/feed
router.get("/", pokemonController.getAllPokemon);

// GET specific pokemon using _id
router.get("/:_id", pokemonController.getSpecificPokemon);

// Create a POST route to create a new contact.
router.post("/", pokemonController.postPokemon);

//Create a PUT route to update a contact. This route should allow for a url
router.put("/:_id", pokemonController.putPokemon);

// Create a DELETE route to delete a contact.
router.delete("/:_id", pokemonController.deletePokemon);

// localhost:8080/pokemon/
module.exports = router;
