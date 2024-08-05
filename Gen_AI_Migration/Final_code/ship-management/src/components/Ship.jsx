import React, { useState } from "react";
import "./Ship.css";

const Ship = () => {
  const [shipData, setShipData] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddShipment = (e) => {
    e.preventDefault();
    const newShipment = {
      shipId: e.target.shipId.value,
      shipDesc: e.target.shipDesc.value,
      shipDate: e.target.shipDate.value,
    };
    setShipData([...shipData, newShipment]);
    setShowAddForm(false);
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
              <tr key={shipment.shipId}>
                <td>{shipment.shipId}</td>
                <td>{shipment.shipDesc}</td>
                <td>{shipment.shipDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="footer">
        <button>F3 = Exit</button>
        <button>F4 = Delivery</button>
        <button onClick={() => setShowAddForm(true)}>Add</button>
        
      </div>
      {showAddForm && (
        <form className="add-form" onSubmit={handleAddShipment}>
          <h2>New Shipment</h2>
          <label htmlFor="shipId">Shipment Id:</label>
          <input type="text" id="shipId" />
          <br />
          <label htmlFor="shipDesc">Shipment Desc:</label>
          <input type="text" id="shipDesc" />
          <br />
          <label htmlFor="shipDate">Shipment Date:</label>
          <input type="date" id="shipDate" />
          <br />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default Ship;