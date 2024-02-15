const { request, response } = require("express");
const mongodb = require("../db/connect");
var ObjectId = require("mongodb").ObjectId;

// I feel like the try/catches here make it a little ugly.
// I'll get rid of the try/catches in the next iteration
// or project, since we are already have the try/catchAll esk
// Node way of doing it in the server.js file I.E. "process.on()"
const getAllPokemon = async (request, response, next) => {
  try {
    // The .find() does not return a promise, it will wait/block,
    // until its completion and then return a cursor.
    // thus no use for await here.
    const result = mongodb.getDb().db().collection("pokemon").find();
    // Here you must use await, as mongodb's .toArray
    // returns a promise, thus you must await a promise.
    // Otherwise if you attempt to use a promise without
    // an await you will get a promise as a result of you not
    // awaiting.
    receivedResult = await result.toArray();
    empty = [];
    //console.log(receivedResult);
    //console.log(empty);
    // In JavaScript, the comparison operator will make
    // sure that arrays ARE the same array.
    // Like you know ADDRESSES!
    // Tomorrow morning compare the ==
    // with the json stringify
    // and if notfound it will return an empty [].
    // Now you can compare them correctly and return
    // an appropiate message in your header, and
    // this should work in your findSpecificPokemon
    // as well. Thank you self for staying and getting this done.
    if (JSON.stringify(receivedResult) == JSON.stringify(empty)) {
      console.log("none");
      response.setHeader("Content-Type", "application/json");
      response
        .status(400)
        .json(
          "Nothing to be found, please check your spelling, or add pokemon to the pokedex."
        );
    } else {
      response.setHeader("Content-Type", "application/json");
      response.status(200).json(receivedResult);
    }
  } catch (error) {
    //console.log("in try catch: getAll");
    console.error(error);
  }
};

const getSpecificPokemon = async (request, response, next) => {
  try {
    if (!ObjectId.isValid(request.params._id)) {
      response
        .status(400)
        .json("Must use a valid contact id to find a contact.");
    }
    id = request.params._id;
    //console.log(id);
    let o_id = new ObjectId(id);
    //console.log(o_id);
    // I had to change from findOne to find,
    // because I forget which type it returns, but it
    // doesn't return a cursor like find does so I just
    // changed it to find() since the parameters are the same.
    const result = mongodb
      .getDb()
      .db()
      .collection("pokemon")
      .find({ _id: o_id });
    // Mongodb's toArray returns a promise thus await it.
    receivedResult = await result.toArray();
    // Promise fullfilled now we can work with receivedResult
    empty = [];
    if (JSON.stringify(receivedResult) == JSON.stringify(empty)) {
      console.log("none");
      response.setHeader("Content-Type", "application/json");
      response
        .status(400)
        .json(
          "Nothing to be found, please check your spelling, or input another id"
        );
    } else {
      response.setHeader("Content-Type", "application/json");
      response.status(200).json(receivedResult);
    }
  } catch (error) {
    console.error(error);
  }
};

const postPokemon = async (request, response, next) => {
  try {
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
    if (result.acknowledged) {
      response.setHeader("Content-Type", "application/json");
      response.status(201).json(result);
      //response.redirect("/")
    } else {
      response
        .status(500)
        .json(response.error || "An error occured while deleting the pokemon");
    }
  } catch (error) {
    console.error(error);
  }
};

const putPokemon = async (request, response, next) => {
  try {
    if (!ObjectId.isValid(request.params._id)) {
      response
        .status(400)
        .json("Must use a valid contact id to update a contact.");
    }
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
    if (result.modifiedCount > 0) {
      response.setHeader("Content-Type", "application/json");
      response.status(204).json(result);
    } else {
      // Might want to use a logger in a case where sensitive information is
      // output by the error.
      response
        .status(500)
        .json(response.error || "An error occured while deleting the pokemon");
    }
  } catch (error) {
    console.error(error);
  }
};
// A little overkill on the error handling here,
// I guess maybe not, the db function could still break so yeah.
const deletePokemon = async (request, response, next) => {
  try {
    if (!ObjectId.isValid(request.params._id)) {
      response
        .status(400)
        .json("Must use a valid contact id to delete a contact.");
    }
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
    if (result.deletedCount > 0) {
      response.setHeader("Content-Type", "application/json");
      response.status(200).json(result);
    } else {
      response
        .status(500)
        .json(response.error || "An error occured while deleting the pokemon");
    }
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
