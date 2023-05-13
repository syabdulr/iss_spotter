// Import the 'nextISSTimesForMyLocation' function from the './iss_promised.js' module
const { nextISSTimesForMyLocation } = require("./iss_promised.js");

// Define a function to print the ISS pass times
function printPassTimes(passTimes) {
  // Iterate through each pass time in the array
  for (const pass of passTimes) {
    // Convert the UNIX timestamp to a JavaScript Date object
    const datetime = new Date(pass.risetime * 1000);
    // Print the pass time and duration
    console.log(`Next pass at ${datetime} for ${pass.duration} seconds`);
  }
}

// Call the 'nextISSTimesForMyLocation' function to retrieve ISS pass times
nextISSTimesForMyLocation()
  .then((passTimes) => {
    // Pass the retrieved pass times to the 'printPassTimes' function
    printPassTimes(passTimes);
  })
  .catch((error) => {
    // Handle any errors that occur during the process
    console.log("It didn't work: ", error.message);
  });
