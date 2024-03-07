const validator = require("../helpers/validateTrainers");

const saveContact = (request, response, next) => {
  const validationRule = {
    fName: "required|string",
    lName: "required|string",
    hometown: "required|string",
    region: "required|string",
    style: "required|string",
    professor: "required|string",
    favoritePokemon: "required|string",
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
