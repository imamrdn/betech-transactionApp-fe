import React, { useEffect, useState } from "react";
import axios from "axios";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);

  const fetchTransactions = async () => {
    const token = localStorage.getItem("x-access-token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/transactions", {
        headers: {
          "x-access-token": token,
        },
      });
      setTransactions(response.data.data.transactions);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Failed to fetch transactions"
      );
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <div className="bg-white shadow-md p-6 w-full max-w-md m-4 rounded-lg">
        <h1>Transaction List</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id}>
              <p>{transaction.description}</p>
              <p>{transaction.amount}</p>
            </div>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Transactions;
