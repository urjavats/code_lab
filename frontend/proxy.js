const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

// Enable CORS for local development
app.use(cors());

// Log all incoming requests to help debug
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Forward the request to Codeforces API for problems
app.get('/problemset/problems', async (req, res) => {
  try {
    // Log that the request is being processed
    console.log('Fetching problemset from Codeforces API...');
    const problemUrl = 'https://codeforces.com/api/problemset.problems';
    const response = await axios.get(problemUrl);

    // Send back the response to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching problem details:', error);
    res.status(500).json({ message: 'Error fetching problem details' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Proxy server running on http://localhost:${port}`);
});
