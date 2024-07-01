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

    // Fetch the image as a Blob
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        var reader = new FileReader();
        reader.onloadend = function () {
          var base64Data = reader.result.split(',')[1]; // Extract base64 data without the prefix
          extractTextFromBase64Image(base64Data);
        };
        reader.readAsDataURL(blob); // Convert Blob to base64
      })
      .catch(error => {
        console.error("Error fetching image:", error);
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
      .then(response => response.json())
      .then(data => processFetchedData(data))
      .catch(error => {
        console.error("Error fetching data from Google Apps Script:", error);
        document.getElementById('output').textContent = JSON.stringify({ error: error.toString() });
      });
  }

  function processFetchedData(data) {
    try {
      if (typeof data === 'object' && data.error) {
        console.error("Error processing data:", data.error);
        document.getElementById('output').textContent = JSON.stringify(data, null, 2);
        return;
      }

      var rawJson = data.candidates[0].content.parts[0].text;
      var cleanedJson = rawJson.replace(/```json\n/g, '').replace(/\n```/g, '');
      var parsedData = JSON.parse(cleanedJson);

      console.log("Processed Data:", parsedData);
      displayData(parsedData);
    } catch (error) {
      console.error("Error processing data:", error);
      document.getElementById('output').textContent = JSON.stringify({ error: error.toString() });
    }
  }

  function displayData(data) {
    data.forEach(row => {
      if (row.Type === "Category") {
        row.Level = "";
        row["Is Alcohol"] = "";
        row["Is Bike Friendly"] = "";
      }
    });

    var table = new Tabulator("#output", {
      height: "100%",
      data: data,
      layout: "fitColumns",
      pagination: false,
      columns: [
        { title: "Type", field: "Type", editor: "select", editorParams: { values: ["Category", "Item Name", "Addons", "Top-ups", "Option"] } },
        { title: "Item Name", field: "Item Name", editor: "input" },
        { title: "Description", field: "Description", editor: "input" },
        { title: "Price", field: "Price", editor: "input" },
        { title: "Minimum Option Selections", field: "Minimum Option Selections", editor: "input" },
        { title: "Maximum Option Selections", field: "Maximum Option Selections", editor: "input" },
        { title: "Number of Free Options", field: "Number of Free Options", editor: "input" },
        { title: "Level", field: "Level", editor: "input" },
        { title: "Is Alcohol", field: "Is Alcohol", editor: "select", editorParams: { values: ["true", "false"] } },
        { title: "Is Bike Friendly", field: "Is Bike Friendly", editor: "select", editorParams: { values: ["true", "false"] } }
      ]
    });

    if (!document.getElementById("copyButtons")) {
      var copyButtonsDiv = document.createElement("div");
      copyButtonsDiv.id = "copyButtons";

      var copyHeaderButton = document.createElement("button");
      copyHeaderButton.innerText = "Copy Headers";
      copyHeaderButton.onclick = function() {
        copyTableHeaders(table);
      };

      var copyDataButton = document.createElement("button");
      copyDataButton.innerText = "Copy Data";
      copyDataButton.onclick = function() {
        copyTableData(table);
      };

      copyButtonsDiv.appendChild(copyHeaderButton);
      copyButtonsDiv.appendChild(copyDataButton);
      document.body.insertBefore(copyButtonsDiv, document.getElementById("output"));
    }
  }

  function copyTableHeaders(table) {
    var columns = table.getColumns();
    var headers = columns.map(col => col.getField());
    var csvContent = headers.join("\t") + "\n";

    navigator.clipboard.writeText(csvContent).then(function() {
      alert("Table headers copied to clipboard");
    }, function(err) {
      console.error("Could not copy text: ", err);
    });
  }

  function copyTableData(table) {
    var columns = table.getColumns();
    var headers = columns.map(col => col.getField());
    var rows = table.getData();
    var csvContent = headers.join("\t") + "\n";

    rows.forEach(row => {
      var rowArray = headers.map(header => row[header]);
      csvContent += rowArray.join("\t") + "\n";
    });

    navigator.clipboard.writeText(csvContent).then(function() {
      alert("Table data copied to clipboard");
    }, function(err) {
      console.error("Could not copy text: ", err);
    });
  }

  window.fetchBase64 = fetchBase64;
});
