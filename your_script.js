// Load fast-json-stable-stringify library
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

loadScript("https://cdn.jsdelivr.net/npm/fast-json-stable-stringify@2.1.0/index.min.js", function() {
  console.log("fast-json-stable-stringify loaded");

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
      if (typeof data === 'object' && data.error) {
        console.error("Error processing data:", data.error);
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
        return;
      }

      const rawText = data.candidates[0].content.parts[0].text;
      const cleanedResponse = rawText.replace(/```json\n|```/g, '').trim();
      const parsedData = JSON.parse(cleanedResponse);

      // Format the data for Tabulator
      const formattedData = formatDataForTabulator(parsedData);

      console.log("Processed Data:", formattedData);
      document.getElementById('output').textContent = JSON.stringify(formattedData, null, 2);
    } catch (error) {
      console.error("Error processing data:", error);
      document.getElementById('output').textContent = JSON.stringify({ error: error.toString() });
    }
  }

  function formatDataForTabulator(data) {
    return data.map(item => ({
      Type: item.Type,
      "Item Name": item["Item Name"],
      Description: item.Description,
      Price: item.Price,
      "Minimum Option Selections": item["Minimum Option Selections"],
      "Maximum Option Selections": item["Maximum Option Selections"],
      "Number of Free Options": item["Number of Free Options"],
      Level: item.Level,
      "Is Alcohol": item["Is Alcohol"],
      "Is Bike Friendly": item["Is Bike Friendly"]
    }));
  }

  // Expose fetchData to the global scope
  window.fetchData = fetchData;
});
