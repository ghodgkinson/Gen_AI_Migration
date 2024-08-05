const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(cors());

app.use(bodyParser.json());

const dataPath = path.join(__dirname, "data", "clntrec.dat");

app.post("/api/add-record", (req, res) => {
  const { Shipid, ShipDesc, ShipDate } = req.body;

  if (!Shipid) {
    return res.status(400).json({ WErrMsg: "Invalid ShipId" });
  } else if (!ShipDesc) {
    return res.status(400).json({ WErrMsg: "Blank Desc" });
  } else if (!ShipDate) {
    return res.status(400).json({ WErrMsg: "Blank date" });
  }

  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err && err.code !== "ENOENT") {
      console.error(err);
      return res.status(500).json({ WErrMsg: "Internal server error" });
    }

    let rrn = 0;
    let records = [];

    if (data) {
      const lines = data.trim().split("\n");
      rrn = parseInt(lines[0], 10) || 0;
      records = lines.slice(1).map((line) => JSON.parse(line));
    }

    rrn++;

    const newRecord = {
      Shipid,
      ShipDesc,
      ShipDate,
    };

    records.push(newRecord);

    const updatedData = [
      rrn,
      ...records.map((record) => JSON.stringify(record)),
    ].join("\n");
    fs.writeFile(dataPath, updatedData, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ WErrMsg: "Internal server error" });
      }

      res.status(200).json({ WErrMsg: "Successful" });
    });
  });
});

app.get("/api/ship", (req, res) => {:q!

  console.log("Received request for /api/ship");

  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading data file:", err);
      return res.status(500).json({ WErrMsg: "Internal server error" });
    }

    console.log("Data read from file:", data);
    let records = [];
    if (data) {
      const lines = data.trim().split("\n");
      lines.slice(1).forEach((line) => {
        const record = JSON.parse(line);
        records.push(record);
      });
    }

    res.status(200).json(records);
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
