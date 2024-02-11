const { request } = require("express");
const mongodb = require("../db/connect");
var ObjectId = require("mongodb").ObjectId;

const getAllPokemon = async (req, res, next) => {
  try {
    const result = await mongodb.getDb().db().collection("pokemon").find();
    result.toArray().then((array) => {
      res.setHeader("Content-Type", "application/json");
      res.status(200).json(array);
    });
  } catch (error) {
    console.error(error);
  }
};

const getSpecificPokemon = async (req, res, next) => {
  try {
    id = req.params._id;
    //console.log(id);
    let o_id = new ObjectId(id);
    //console.log(o_id);
    const result = await mongodb
      .getDb()
      .db()
      .collection("pokemon")
      .findOne({ _id: o_id });
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
  }
};

const postPokemon = async (request, response, next) => {
  const pokemon = {
    name: request.body.name,
    pokedexId: request.body.pokedexId,
    type1: request.body.type1,
    type2: request.body.type2,
    favoriteColor: request.body.favoriteColor,
  };
  const result = await mongodb
    .getDb()
    .db()
    .collection("pokemon")
    .insertOne(pokemon);
  response.setHeader("Content-Type", "application/json");
  response.status(201).json(result);
  //response.redirect("/")
};

const putPokemon = async (request, response, next) => {
  try {
    id = request.params._id;
    //console.log(id);
    let o_id = new ObjectId(id);
    body = { favoriteColor: request.body.favoriteColor };
    //console.log(body);
    //console.log(body.favoriteColor);
    const result = await mongodb
      .getDb()
      .db()
      .collection("pokemon")
      .updateOne(
        { _id: o_id },
        { $set: { favoriteColor: body.favoriteColor } }
      );
    response.setHeader("Content-Type", "application/json");
    response.status(204).json(result);
  } catch (error) {
    console.error(error);
  }
};

const deletePokemon = async (request, response, next) => {
  try {
    id = request.params._id;
    o_id = new ObjectId(id);
    body = {
      _id: o_id,
    };
    const result = await mongodb
      .getDb()
      .db()
      .collection("pokemon")
      .deleteOne(body);
    response.setHeader("Content-Type", "application/json");
    response.status(200).json(result);
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getAllPokemon,
  getSpecificPokemon,
  postPokemon,
  putPokemon,
  deletePokemon,
};
