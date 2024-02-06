// Import necessary modules
const express = require('express');
const router = express.Router();
const request = require('request'); // Ensure you have 'request' installed via npm

// Define your route

router.get('/getRandom', (req, res) => {
  // return a working message
  res.send('This is the exercise route!');
});

// router.get('/exercise', (req, res) => {
//   // You could allow clients to specify the muscle as a query parameter
//   const muscle = req.query.muscle || 'biceps'; // Default to 'biceps' if not specified

//   // Set up the options for the third-party API request
//   const options = {
//     url: 'https://api.api-ninjas.com/v1/exercises?muscle=' + muscle,
//     headers: {
//       'X-Api-Key': process.env.API_KEY // Replace 'YOUR_API_KEY' with your actual API key
//     }
//   };

//   // Make the request to the third-party API
//   request.get(options, (error, response, body) => {
//     if (error) {
//       console.error('Request failed:', error);
//       res.status(500).send('Internal Server Error');
//     } else if (response.statusCode != 200) {
//       console.error('Error:', response.statusCode, body.toString('utf8'));
//       res.status(response.statusCode).send(body.toString('utf8'));
//     } else {
//       // Assuming the body is in JSON format; if not, you may need to parse it
//       res.json(JSON.parse(body));
//     }
//   });
// });

module.exports = router;
