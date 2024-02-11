const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Pokemon API",
    description: "Project 2 for cse341",
  },
  host: "https://pokemon-ktdm.onrender.com",
  schemes: ["https"],
};

const outputFile = "./swagger.json";
const routes = ["./routes/pokemon.js"];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./server"); // Your project's root file
});
