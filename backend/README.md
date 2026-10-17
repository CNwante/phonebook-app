# Phonebook Backend

An Express backend developed as part of **Full Stack Open, Part 3**.

The backend provides an API for managing phonebook entries and serves the production-built React frontend.

### Live Deployment

- **Application:** https://phonebook-5fbx.onrender.com/
- **API:** https://phonebook-5fbx.onrender.com/api/persons

### Frontend Integration

The frontend uses a relative API URL, allowing it to communicate with the backend on the same origin in production.

The production frontend build is stored in the `dist/` directory and served by Express. During local development, Vite's proxy forwards API requests to the backend so the frontend can run using `npm run dev`.
