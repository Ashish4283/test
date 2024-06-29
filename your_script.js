function fetchData() {
  var imageUrl = document.getElementById('imageUrl').value;
  if (!imageUrl) {
    alert("Please enter a valid image URL.");
    return;
  }
  google.script.run.withSuccessHandler(processFetchedData).extractTextFromImageUrl(imageUrl);
}

function processFetchedData(data) {
  try {
    var parsedData = JSON.parse(data);
    console.log("Processed Data:", parsedData);
    document.getElementById('output').textContent = JSON.stringify(parsedData, null, 2);
  } catch (error) {
    console.error("Error processing data:", error);
    document.getElementById('output').textContent = JSON.stringify({ error: error.toString() });
  }
}
