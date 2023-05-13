// Import the 'fetchMyIP', 'fetchCoordsByIP', and 'fetchISSFlyOverTimes' functions from the 'iss' module
const { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation } = require('./iss');

// Call the 'fetchMyIP' function to get the IP address of the user's computer
fetchMyIP((error, ip) => {
  // If an error occurs during the IP fetching, log the error message and return immediately to exit the function
  if (error) {
    console.log("It didn't work!", error);
    return;
  }

  // If no error occurred, log a success message along with the fetched IP address
  console.log('It worked! Returned IP:', ip);

  // Call the 'fetchCoordsByIP' function within the callback of 'fetchMyIP' to get the geographic coordinates associated with the fetched IP address
  fetchCoordsByIP(ip, (error, data) => {
    // If an error occurs during the coordinate fetching, log the error message and return immediately to exit the function
    if (error) {
      console.log('Error:', error);
      return;
    }

    // If no error occurred, log a message along with the fetched coordinates
    console.log('Data:', data);

    // Call 'fetchISSFlyOverTimes' function within the callback of 'fetchCoordsByIP' to get the ISS flyover times for the fetched coordinates
    fetchISSFlyOverTimes(data, (error, passes) => {
      // If an error occurs during the ISS flyover times fetching, log the error message and return immediately to exit the function
      if (error) {
        console.log('Error:', error);
        return;
      }
  
      // If no error occurred, log a message along with the fetched ISS flyover times
      console.log('ISS Flyover Times:', passes);
    });
  });

  nextISSTimesForMyLocation((error, passTimes) => {
    if (error) {
      return console.log("It didn't work!", error);
    }
  
    // Success! Print out the flyover times
    for (const pass of passTimes) {
      const datetime = new Date(pass.risetime * 1000);
      console.log(`Next pass at ${datetime} for ${pass.duration} seconds!`);
    }
  });

});
