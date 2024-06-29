function processFetchedData(data) {
  try {
    // Your processing logic here
    var parsedData = JSON.parse(data);
    // Do something with parsedData
    console.log("Processed Data:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error processing data:", error);
    return { error: error.toString() };
  }
}
