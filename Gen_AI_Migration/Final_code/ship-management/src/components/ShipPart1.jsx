import React, { useState, useEffect } from "react";
import "./Ship.css";

const ShipPart1 = () => {
  const [shipData, setShipData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [shipId, setShipId] = useState("");
  const [shipDesc, setShipDesc] = useState("");
  const [shipDate, setShipDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/ship")
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            throw new Error(`Network response was not ok: ${text}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        setShipData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError("Error fetching data: " + error.message);
      });
  }, []);

  const handleAddShipment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/add-record", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Shipid: shipId,
          ShipDesc: shipDesc,
          ShipDate: shipDate,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.WErrMsg || "Network response was not ok");
      }

      const result = await response.json();
      setShipData([
        ...shipData,
        { Shipid: shipId, ShipDesc: shipDesc, ShipDate: shipDate },
      ]);
      setShowAddForm(false);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Internal server error");
    }
  };

  return (
    <div className="container">
      <h1>Sample subfile for shipment</h1>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Ship Id</th>
              <th>Ship Desc</th>
              <th>Ship Date</th>
            </tr>
          </thead>
          <tbody>
            {shipData.map((shipment) => (
              <tr key={shipment.Shipid}>
                <td>{shipment.Shipid}</td>
                <td>{shipment.ShipDesc}</td>
                <td>{shipment.ShipDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <button>F3 = Exit</button>
        <button>F4 = Delivery</button>
        <button onClick={() => setShowAddForm(true)}>F6 = Add</button>
      </div>
      {showAddForm && (
        <form className="add-form" onSubmit={handleAddShipment}>
          <h2>New Shipment</h2>
          <label htmlFor="shipId">Shipment Id:</label>
          <input
            type="text"
            id="shipId"
            value={shipId}
            onChange={(e) => setShipId(e.target.value)}
          />
          <br />
          <label htmlFor="shipDesc">Shipment Desc:</label>
          <input
            type="text"
            id="shipDesc"
            value={shipDesc}
            onChange={(e) => setShipDesc(e.target.value)}
          />
          <br />
          <label htmlFor="shipDate">Shipment Date:</label>
          <input
            type="date"
            id="shipDate"
            value={shipDate}
            onChange={(e) => setShipDate(e.target.value)}
          />
          <br />
          <button type="submit">Enter = Add</button>
          <button type="button" onClick={() => setShowAddForm(false)}>
            F12 = Cancel
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
    </div>
  );
};

export default ShipPart1;
