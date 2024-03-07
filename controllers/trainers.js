const { request, response } = require("express");
const mongodb = require("../db/connect");
var ObjectId = require("mongodb").ObjectId;

const getAllTrainers = async (request, response, next) => {
  try {
    const result = mongodb.getDb().db().collection("trainers").find();

    receivedResult = await result.toArray();
    empty = [];

    if (JSON.stringify(receivedResult) == JSON.stringify(empty)) {
      console.log("none");
      response.setHeader("Content-Type", "application/json");
      response
        .status(400)
        .json(
          "Nothing to be found, please check your spelling, or add trainers."
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

const getSpecificTrainer = async (request, response, next) => {
  try {
    if (!ObjectId.isValid(request.params._id)) {
      response
        .status(400)
        .json("Must use a valid contact id to find a contact.");
    }
    id = request.params._id;
    //console.log(id);
    let o_id = new ObjectId(id);
    const result = mongodb
      .getDb()
      .db()
      .collection("trainers")
      .find({ _id: o_id });
    receivedResult = await result.toArray();
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

const postTrainer = async (request, response, next) => {
  try {
    const trainer = {
      fName: request.body.fName,
      lName: request.body.lName,
      hometown: request.body.hometown,
      region: request.body.region,
      style: request.body.style,
      professor: request.body.professor,
      favoritePokemon: request.body.favoritePokemon,
    };
    const result = await mongodb
      .getDb()
      .db()
      .collection("trainers")
      .insertOne(trainer);
    if (result.acknowledged) {
      response.setHeader("Content-Type", "application/json");
      response.status(201).json(result);
      //response.redirect("/")
    } else {
      response
        .status(500)
        .json(response.error || "An error occured while deleting the trainer");
    }
  } catch (error) {
    console.error(error);
  }
};

const putTrainer = async (request, response, next) => {
  try {
    if (!ObjectId.isValid(request.params._id)) {
      response
        .status(400)
        .json("Must use a valid contact id to update a contact.");
    }
    id = request.params._id;
    //console.log(id);
    let o_id = new ObjectId(id);
    body = {
      fName: request.body.fName,
      lName: request.body.lName,
      hometown: request.body.hometown,
      region: request.body.region,
      style: request.body.style,
      professor: request.body.professor,
      favoritePokemon: request.body.favoritePokemon,
    };
    //console.log(body);
    //console.log(body.favoriteColor);
    const result = await mongodb
      .getDb()
      .db()
      .collection("trainers")
      .updateOne(
        { _id: o_id },
        { $set: { favoritePokemon: body.favoritePokemon } }
      );
    if (result.modifiedCount > 0) {
      response.setHeader("Content-Type", "application/json");
      response.status(204).json(result);
    } else {
      // Might want to use a logger in a case where sensitive information is
      // output by the error.
      response
        .status(500)
        .json(response.error || "An error occured while deleting the trainer");
    }
  } catch (error) {
    console.error(error);
  }
};

const deleteTrainer = async (request, response, next) => {
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
      .collection("trainers")
      .deleteOne(body);
    if (result.deletedCount > 0) {
      response.setHeader("Content-Type", "application/json");
      response.status(200).json(result);
    } else {
      response
        .status(500)
        .json(response.error || "An error occured while deleting the trainer");
    }
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  getAllTrainers,
  getSpecificTrainer,
  postTrainer,
  putTrainer,
  deleteTrainer,
};
