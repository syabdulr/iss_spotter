// Import the 'request-promise-native' module
const request = require('request-promise-native');

/*
 * Requests user's IP address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of a request for IP data, returned as a JSON string
 */
const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

/*
 * Retrieves the coordinates (latitude and longitude) for a given IP address
 * Input: 'body' - the response body containing the IP address
 * Returns: Promise of a request for the coordinates data, returned as a JSON string
 */
const fetchCoordsByIP = function(body) {
  // Parse the IP address from the response body
  const ip = JSON.parse(body).ip;
  // Send a request to obtain the coordinates using the IP address
  return request(`http://ipwho.is/${ip}`);
}

/*
 * Retrieves the ISS flyover times based on the provided coordinates
 * Input: 'body' - the response body containing the coordinates
 * Returns: Promise of a request for the ISS flyover times data, returned as a JSON string
 */
const fetchISSFlyOverTimes = function(body){
  // Parse the latitude and longitude from the response body
  const { latitude, longitude } = JSON.parse(body);
  // Construct the URL with the latitude and longitude
  const url = `https://iss-flyover.herokuapp.com/json/?lat=${latitude}&lon=${longitude}`;
  // Send a request to obtain the ISS flyover times using the coordinates
  return request(url);
}

/* 
 * Retrieves the ISS flyover times for the user's location
 * Input: None
 * Returns: Promise for the flyover data for the user's location
 */
const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      // Parse the response data and extract the necessary flyover times
      const { response } = JSON.parse(data);
      return response;
    });
};

// Export the 'nextISSTimesForMyLocation' function to make it accessible to other modules
module.exports = { nextISSTimesForMyLocation };
