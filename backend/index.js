const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());

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

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 1000000000).toString();
};

app.post("/api/persons", (request, response) => {
  const contact = request.body;

  if (!contact.name) {
    return response.status(400).json({ error: "name must be provided" });
  }

  if (!contact.number) {
    return response.status(400).json({ error: "number must be provided" });
  }

  const nameExists = persons.some(
    (person) => person.name.toLowerCase() === contact.name.toLowerCase(),
  );

  if (nameExists) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: generateId(),
    name: contact.name,
    number: contact.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  const totalContact = persons.length;
  const currentDate = new Date().toString();
  response.send(
    `The Phonebook has info for ${totalContact} people. <br><br>
    ${currentDate}`,
  );
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
