const request = require('request');

const fetchMyIP = function(callback) { 
  request('https://api.ipify.org/?format=json', (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(msg, null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
  });
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    const data = JSON.parse(body);
    if (!data.success || data.ip !== ip) {
      const errorMessage = `It didn't work! Error: Success status was false. Server message says: Invalid IP address when fetching for IP ${ip}`;
      callback(errorMessage, null);
      return;
    }

    const coordinates = {
      latitude: data.latitude.toFixed(5),
      longitude: data.longitude.toFixed(5)
    };

    callback(null, coordinates);
  });
};


module.exports = { fetchMyIP, fetchCoordsByIP };
