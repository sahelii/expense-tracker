import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  function fetchTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    fetch(url).then(response => response.json()).then(data => {
      setTransactions(data);
    });
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = parseFloat(name.split(' ')[0]);
    const transactionName = name.substring(price.toString().length + 1);

    console.log("Submitting transaction:", { price, name: transactionName, description, datetime });

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        price,
        name: transactionName,
        description,
        datetime,
      })
    }).then(response => {
      response.json().then(json => {
        console.log("Transaction saved:", json);
        setName('');
        setDatetime('');
        setDescription('');
        fetchTransactions(); // Fetch the updated list of transactions
      }).catch(err => {
        console.error("Error saving transaction:", err);
      });
    }).catch(err => {
      console.error("Error in request:", err);
    });
  }

  function filterTransactions() {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.datetime);
      return (!startDate || new Date(startDate) <= transactionDate) &&
        (!endDate || new Date(endDate) >= transactionDate);
    });
  }

  return (
    <main>
      <h1>₹{filterTransactions().reduce((acc, transaction) => acc + transaction.price, 0).toFixed(2)}</h1>
      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder={'Cost'}
          />
          <input
            value={datetime}
            onChange={(ev) => {setDatetime(ev.target.value)}}
            type="datetime-local"
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder={'Description'}
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className="transactions">
        {filterTransactions().map(transaction => (
          <div className="transaction" key={transaction._id}>
            <div className="left">
              <div className="name">{transaction.name}</div>
              <div className="description">{transaction.description}</div>
            </div>
            <div className="right">
              <div className={`price ${transaction.price >= 0 ? 'green' : 'red'}`}>
                {transaction.price >= 0 ? '+' : '-'}₹{Math.abs(transaction.price).toFixed(2)}
              </div>
              <div className="datetime">{new Date(transaction.datetime).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
