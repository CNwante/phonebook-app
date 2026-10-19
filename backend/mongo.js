const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = encodeURIComponent(process.argv[2]);

const url = `mongodb+srv://phonebook_db:${password}@cluster0.hhb87nf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model("Phonebook", phonebookSchema);

if (process.argv.length === 3) {
  displayPhonebook();
} else if (process.argv.length === 5) {
  saveContact();
} else {
  console.log("Error: Please provide both a name and a phone number to save.");
  console.log(`Usage for saving: node mongo.js <password> "<name>" <number>`);
  mongoose.connection.close();
}

function displayPhonebook() {
  console.log("Fetching all contacts from database...");

  Phonebook.find({}).then((contacts) => {
    console.log("phonebook:");
    contacts.forEach((contact) => {
      console.log(`${contact.name} ${contact.number}`);
    });
    mongoose.connection.close();
  });
}

function saveContact() {
  console.log("Saving the contact...");

  const contact = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
  });

  contact.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
}
