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

  // Ensure that fastJsonStableStringify is available in the global scope
  const fastJsonStableStringify = window.stringify;

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

      // Clean the response
      const cleanedResponse = data.candidates[0].content.parts[0].text.replace(/```json\n|```/g, '').trim();
      const parsedData = JSON.parse(cleanedResponse);

      console.log("Processed Data:", parsedData);
      document.getElementById('output').textContent = JSON.stringify(parsedData, null, 2);
    } catch (error) {
      console.error("Error processing data:", error);
      document.getElementById('output').textContent = JSON.stringify({ error: error.toString() });
    }
  }

  // Expose fetchData to the global scope
  window.fetchData = fetchData;
});
