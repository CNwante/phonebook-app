# Phonebook Frontend

This React frontend was extracted from the Part 2 phonebook exercise of the Full Stack Open course.

A separate copy was created for Part 3 to implement the required backend integration and deployment changes without affecting the original Part 2 implementation.

### API Configuration

The frontend uses a relative API URL to communicate with the backend in production.

During development, the Vite proxy forwards API requests to the backend, allowing the frontend to run with `npm run dev` without changing the API URL.
