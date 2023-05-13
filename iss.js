// Import the 'request' module which allows making HTTP requests in Node.js
const request = require('request');

// Define a function 'fetchMyIP' that fetches the IP address of the user's computer
const fetchMyIP = function (callback) {
  // Make a request to 'https://api.ipify.org' which returns the client's IP address in JSON format
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    // If an error occurs during the request, call the callback function with the error as the first argument
    if (error) {
      callback(error, null);
      return;
    }

    // If the status code of the response is not 200 (which means the request was not successful), call the callback function with a custom error message
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(msg, null);
      return;
    }

    // Parse the body of the response (which is a JSON string) to a JavaScript object and extract the 'ip' property
    const ip = JSON.parse(body).ip;
    // Call the callback function with no error and the IP address
    callback(null, ip);
  });
};

// Define a function 'fetchCoordsByIP' that fetches the geographic coordinates (latitude, longitude) for a given IP address
const fetchCoordsByIP = function (ip, callback) {
  // Make a request to 'https://ipwho.is' with the IP address in the URL to get the geographic location associated with that IP
  request(`https://ipwho.is/${ip}`, (error, response, body) => {
    // Similar error handling as in 'fetchMyIP'
    if (error) {
      callback(error, null);
      return;
    }

    // Parse the body of the response to a JavaScript object
    const data = JSON.parse(body);
    // Check if the 'success' property is falsy or the returned IP does not match the requested IP. If so, call the callback function with a custom error message
    if (!data.success || data.ip !== ip) {
      const errorMessage = `It didn't work! Error: Success status was false. Server message says: Invalid IP address when fetching for IP ${ip}`;
      callback(errorMessage, null);
      return;
    }

    // Create an object with the latitude and longitude values, converting them to fixed point numbers with 5 digits after the decimal point
    const coordinates = {
      latitude: data.latitude.toFixed(5),
      longitude: data.longitude.toFixed(5)
    };

    // Call the callback function with no error and the coordinates
    callback(null, coordinates);
  });
};

// Define a function 'fetchISSFlyOverTimes' that fetches the International Space Station (ISS) fly over times for a given set of geographic coordinates
const fetchISSFlyOverTimes = function (coordinates, callback) {
  // Build the URL for the request using the latitude and longitude
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  console.log(url);
  // Make the request
  request(url, (error, response, body) => {
    // Similar error handling as before
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS pass times: ${body}`;
      callback(msg, null);
      return;
    }

    // Parse the body of the response to a JavaScript object and extract the 'response' property, which contains the ISS pass times
    const passes = JSON.parse(body).response;
    // Call the callback function with no error and the pass times
    callback(null, passes);
  });
};

// iss.js

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
const nextISSTimesForMyLocation = function(callback) {
  // Call fetchMyIP to get the IP address
  fetchMyIP((error, ip) => {
    if (error) {
      callback(error, null);
      return;
    }

    // Call fetchCoordsByIP to get the coordinates
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        callback(error, null);
        return;
      }

      // Call fetchISSFlyOverTimes to get the flyover times
      fetchISSFlyOverTimes(coordinates, (error, passes) => {
        if (error) {
          callback(error, null);
          return;
        }

        // Success! Call the callback with no error and the flyover times
        callback(null, passes);
      });
    });
  });
};

// Export the three functions 'fetchMyIP', 'fetchCoordsByIP', and 'fetchISSFlyOverTimes' as properties of an object, so they can be imported in index.js
module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };

