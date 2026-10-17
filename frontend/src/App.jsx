import { useState, useEffect } from "react"
import personService from "./services/persons"
import Notification from "./components/Notification"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [nameFilter, setNameFilter] = useState("")
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    personService
      .getAllContacts()
      .then((initialContacts) => setPersons(initialContacts))
  }, [])

  const existingPerson = persons.find(
    (person) => person.name.toLowerCase() === newName.toLowerCase(),
  )

  const addPerson = (event) => {
    event.preventDefault()
    if (newName.trim().length === 0 || newNumber.trim().length === 0) {
      setError(true)
      setMessage("Name and Number fields cannot be empty")
      setTimeout(() => {
        setMessage(null)
      }, 3000)
      return
    }

    if (existingPerson) {
      const confirmOverwrite = window.confirm(
        `${newName} is already added to phonebook, replace the old number with the new one`,
      )

      if (confirmOverwrite) {
        const updatedObject = {
          name: existingPerson.name,
          number: newNumber,
        }

        personService
          .updateContact(existingPerson.id, updatedObject)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : updatedPerson,
              ),
            )
            setNewName("")
            setNewNumber("")
          })
      }
      return
    }

    const personObject = {
      name: newName,
      number: newNumber,
    }

    personService.createContact(personObject).then((person) => {
      setPersons(persons.concat(person))
      setMessage(`Added ${person.name}`)
      setNewName("")
      setNewNumber("")
      setError(false)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    })
  }

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(nameFilter.toLowerCase()),
  )

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const handleDelete = (id) => {
    const targetContact = persons.find((person) => person.id === id)

    if (window.confirm(`Delete ${targetContact.name}`)) {
      personService
        .deleteContact(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
        })
        .catch(() => {
          setMessage(
            `Information of ${targetContact.name} has already been removed from server`,
          )
          setError(true)
          setTimeout(() => {
            setMessage(null)
          }, 3000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} isError={error} />
      <Filter onChange={handleNameFilterChange} value={nameFilter} />

      <h3>Add a new</h3>
      <PersonForm
        onFormSubmit={addPerson}
        name={newName}
        number={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} onDelete={handleDelete} />
    </div>
  )
}

const Filter = ({ onChange, value }) => {
  return (
    <div>
      filter shown with: <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({
  onFormSubmit,
  name,
  number,
  onNameChange,
  onNumberChange,
}) => {
  return (
    <form onSubmit={onFormSubmit}>
      <div>
        name: <input value={name} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={number} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ filteredPersons, onDelete }) => {
  return (
    <ul>
      {filteredPersons.map((person) => (
        <Person
          key={person.id}
          name={person.name}
          number={person.number}
          onDelete={() => onDelete(person.id)}
        />
      ))}
    </ul>
  )
}

const Person = ({ name, number, onDelete }) => {
  return (
    <li>
      {name}: {number} <button onClick={onDelete}>Delete</button>
    </li>
  )
}

export default App
