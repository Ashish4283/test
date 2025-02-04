// Load fast-json-stable-stringify library
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = callback;
  document.head.appendChild(script);
}

loadScript("https://cdn.jsdelivr.net/npm/fast-json-stable-stringify@2.1.0/index.js", function () {
  console.log("fast-json-stable-stringify loaded");

  function fetchData() {
    var imageUrl = document.getElementById('imageUrl').value;
    if (!imageUrl) {
      alert("Please enter a valid image URL.");
      return;
    }

    // Fetch raw response from Google Apps Script
    fetch(`https://script.google.com/macros/s/AKfycbxCwjo0lAyl2FLgWyA8nSl7hD_GRp5_fwdZ_VgKRNg2i3zzpyAl0fBHRSEGeLcARHg2/exec?imageUrl=${encodeURIComponent(imageUrl)}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error);
        }
        return data.rawResponse;
      })
      .then(rawJson => {
        var cleanedJson = rawJson.replace(/```json\n/g, '').replace(/\n```/g, '');
        var parsedData = JSON.parse(cleanedJson);

        console.log("Processed Data:", parsedData);
        displayData(parsedData);
      })
      .catch(error => {
        console.error("Error fetching data from Google Apps Script proxy:", error);
        document.getElementById('output').textContent = JSON.stringify({ error: error.toString() });
      });
  }

  function displayData(data) {
    // Preprocess data to clear specific columns when Type is "Category"
    data.forEach(row => {
      if (row.Type === "Category") {
        row.Level = "";
        row["Is Alcohol"] = "";
        row["Is Bike Friendly"] = "";
      }
    });

    var table = new Tabulator("#output", {
      height: "100%",  // Adjust height to ensure no pagination
      data: data,
      layout: "fitColumns",
      pagination: false, // Disable pagination
      columns: [
        {
          title: "Type",
          field: "Type",
          editor: "select",
          editorParams: {
            values: ["Category", "Item Name", "Addons", "Top-ups", "Option"]
          },
          cellEdited: function (cell) {
            var row = cell.getRow();
            var rowData = row.getData();
            if (cell.getValue() === "Category") {
              row.update({
                "Level": "",
                "Is Alcohol": "",
                "Is Bike Friendly": ""
              });
            }
          }
        },
        { title: "Item Name", field: "Item Name", editor: "input" },
        { title: "Description", field: "Description", editor: "input" },
        { title: "Price", field: "Price", editor: "input" },
        { title: "Minimum Option Selections", field: "Minimum Option Selections", editor: "input" },
        { title: "Maximum Option Selections", field: "Maximum Option Selections", editor: "input" },
        { title: "Number of Free Options", field: "Number of Free Options", editor: "input" },
        { title: "Level", field: "Level", editor: "input" },
        {
          title: "Is Alcohol",
          field: "Is Alcohol",
          editor: "select",
          editorParams: {
            values: ["true", "false"]
          }
        },
        {
          title: "Is Bike Friendly",
          field: "Is Bike Friendly",
          editor: "select",
          editorParams: {
            values: ["true", "false"]
          }
        },
      ],
    });

    // Ensure the copy buttons are added only once
    if (!document.getElementById("copyButtons")) {
      var copyButtonsDiv = document.createElement("div");
      copyButtonsDiv.id = "copyButtons";

      var copyHeaderButton = document.createElement("button");
      copyHeaderButton.innerText = "Copy Headers";
      copyHeaderButton.onclick = function () {
        copyTableHeaders(table);
      };

      var copyDataButton = document.createElement("button");
      copyDataButton.innerText = "Copy Data";
      copyDataButton.onclick = function () {
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

    navigator.clipboard.writeText(csvContent).then(function () {
      alert("Table headers copied to clipboard");
    }, function (err) {
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

    navigator.clipboard.writeText(csvContent).then(function () {
      alert("Table data copied to clipboard");
    }, function (err) {
      console.error("Could not copy text: ", err);
    });
  }

  // Expose fetchData to the global scope
  window.fetchData = fetchData;
});
