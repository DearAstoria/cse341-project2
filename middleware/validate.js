const validator = require("../helpers/validate");

const saveContact = (request, response, next) => {
  const validationRule = {
    name: "required|string",
    pokedexId: "required|string",
    type1: "required|string",
    type2: "required|string",
    favoriteColor: "string",
  };
  validator(request.body, validationRule, {}, (err, status) => {
    if (!status) {
      response.send(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};

module.exports = { saveContact };
