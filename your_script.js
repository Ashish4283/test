function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

loadScript("https://cdn.jsdelivr.net/npm/fast-json-stable-stringify@2.1.0/index.js", function () {
  console.log("fast-json-stable-stringify loaded");

  function fetchBase64() {
    var imageUrl = document.getElementById('imageUrl').value;
    if (!imageUrl) {
      alert("Please enter a valid image URL.");
      return;
    }

    fetch('https://script.google.com/macros/s/AKfycbxCwjo0lAyl2FLgWyA8nSl7hD_GRp5_fwdZ_VgKRNg2i3zzpyAl0fBHRSEGeLcARHg2/exec?imageUrl=' + encodeURIComponent(imageUrl))
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error("Error fetching Base64 image:", data.error);
          document.getElementById('output').textContent = JSON.stringify({ error: data.error }, null, 2);
        } else {
          extractTextFromBase64Image(data.base64);
        }
      })
      .catch(error => {
        console.error("Error fetching data from Google Apps Script:", error);
        document.getElementById('output').textContent = JSON.stringify({ error: error.toString() });
      });
  }

  function extractTextFromBase64Image(base64Image) {
    fetch('https://script.google.com/macros/s/AKfycbxCwjo0lAyl2FLgWyA8nSl7hD_GRp5_fwdZ_VgKRNg2i3zzpyAl0fBHRSEGeLcARHg2/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ base64Image: base64Image })
    })
    .then(response => response.j
