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
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number format! Must be 2 or 3 digits followed by a hyphen and more digits (e.g., 09-123456 or 040-223344).`,
    },
  },
});

module.exports = mongoose.model("Phonebook", phonebookSchema);
