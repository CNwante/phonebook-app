const mongoose = require("mongoose");

// Global plugin to automatically format all outputs to JSON cleanly
mongoose.plugin((schema) => {
  schema.set("toJSON", {
    transform: (document, returnedObject) => {
      if (returnedObject._id) {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
      }
      delete returnedObject.__v;
    },
  });
});

mongoose.set("strictQuery", false);

const password = process.env.DB_PASSWORD;
let url = process.env.MONGO_URI;

const encodedPassword = encodeURIComponent(password);

url = url.replace("DB_PASSWORD", encodedPassword);

console.log("connecting to MongoDB...");

mongoose
  .connect(url, { family: 4 })
  .then((result) => {
    console.log("successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB", error.message);
  });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

module.exports = mongoose.model("Phonebook", phonebookSchema);
