
import React, { useState, useEffect } from 'react';

const Ship = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [shipID, setShipID] = useState('');
  const [shipDate, setShipDate] = useState('');
  const [shipDesc, setShipDesc] = useState('');

  useEffect(() => {
    // Fetch initial data from the backend
    fetch('/api/ship')
      .then(res => res.json())
      .then(data => {
        setShipID(data.shipID);
        setShipDate(data.shipDate);
        setShipDesc(data.shipDesc);
      })
      .catch(error => {
        setErrorMessage('Error fetching data: ' + error.message);
      });
  }, []);

  const handleAdd = () => {
    // Add the new ship to the backend
    fetch('/api/ship', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        shipID: shipID,
        shipDate: shipDate,
        shipDesc: shipDesc
      })
    })
      .then(res => res.json())
      .then(data => {
        // Display a success message
        setErrorMessage('Ship added successfully');
      })
      .catch(error => {
        // Display an error message
        setErrorMessage('Error adding ship: ' + error.message);
      });
  };

  const handleCancel = () => {
    // Clear the form and reset the error message
    setShipID('');
    setShipDate('');
    setShipDesc('');
    setErrorMessage('');
  };

  return (
    <div>
      <h1>Deliveries</h1>

      <form>
        <label htmlFor="shipID">Ship ID:</label>
        <input type="text" id="shipID" value={shipID} onChange={e => setShipID(e.target.value)} />

        <label htmlFor="shipDate">Ship Date:</label>
        <input type="date" id="shipDate" value={shipDate} onChange={e => setShipDate(e.target.value)} />

        <label htmlFor="shipDesc">Ship Description:</label>
        <input type="text" id="shipDesc" value={shipDesc} onChange={e => setShipDesc(e.target.value)} />

        <button type="button" onClick={handleAdd}>Add</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>

      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default Ship;