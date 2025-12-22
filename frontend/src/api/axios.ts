// WHAT: Import axios library for making HTTP requests
// WHY: axios provides a clean API for making AJAX calls to our backend
// HOW: Import statement brings in the axios module (needs to be installed via npm)
import axios from "axios";

// WHAT: Create a custom axios instance with pre-configured settings
// WHY: Avoids repeating "http://localhost:5000/api" in every API call
// HOW: axios.create() returns a new axios instance with custom defaults
// BENEFIT: All requests using 'api' will automatically use this baseURL
// EXAMPLE: api.post("/chat") becomes POST http://localhost:5000/api/chat
const api = axios.create({
  baseURL: "http://localhost:4000/api", // Base URL prepended to all requests
});

// WHAT: Export the configured axios instance
// WHY: Other components can import this and make API calls easily
// HOW: Default export allows importing with any name (usually 'api')
export default api;
