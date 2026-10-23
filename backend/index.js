const express = require("express");
const morgan = require("morgan");
const Phonebook = require("./models/phonebook");

const app = express();

app.use(express.json());
app.use(express.static("dist"));

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens.body(req, res),
    ].join(" ");
  }),
);

app.get("/api/persons", (request, response) => {
  Phonebook.find({}).then((contacts) => {
    response.json(contacts);
  });
});

app.get("/info", (request, response, next) => {
  const currentDate = new Date().toString();

  Phonebook.countDocuments({})
    .then((totalContacts) => {
      response.send(
        `The Phonebook has info for ${totalContacts} people. <br><br>
        ${currentDate}`,
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Phonebook.findById(request.params.id)
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const contact = request.body;

  const person = new Phonebook({
    name: contact.name,
    number: contact.number,
  });

  person
    .save()
    .then((data) => {
      response.json(data);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { number } = request.body;

  Phonebook.findById(request.params.id)
    .then((contact) => {
      if (!contact) {
        return response.status(404).end();
      }
      contact.number = number;

      return contact.save().then((savedContact) => response.json(savedContact));
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Phonebook.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformated id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
