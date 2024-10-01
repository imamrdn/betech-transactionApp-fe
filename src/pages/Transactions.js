import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsisV } from "react-icons/fa";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState(null);

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

  const togglePopover = (id) => {
    setPopoverVisible((prevVisible) => (prevVisible === id ? null : id));
  };

  const handleEdit = (id) => {
    const transactionToEdit = transactions.find((t) => t.id === id);
    setCurrentTransaction(transactionToEdit);
    setModalVisible(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const transactionData = {
      description: formData.get("description"),
      type: formData.get("type"),
      amount: formData.get("amount"),
      date: formData.get("date"),
    };

    try {
      const token = localStorage.getItem("x-access-token");
      if (!token) {
        setError("Token tidak ditemukan. Silakan login.");
        return;
      }

      if (currentTransaction) {
        await axios.put(
          `http://localhost:5000/transactions/${currentTransaction.id}`,
          transactionData,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
      } else {
        await axios.post(
          "http://localhost:5000/transactions",
          transactionData,
          {
            headers: {
              "x-access-token": token,
            },
          }
        );
      }

      setModalVisible(false);
      setCurrentTransaction(null);
      fetchTransactions();
    } catch (error) {
      console.error("Error saving transaction:", error);
      setError(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Failed to save transaction"
      );
    }
  };

  const handleDelete = (id) => {
    setDeleteTransactionId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem("x-access-token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/transactions/${deleteTransactionId}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      fetchTransactions();
      setDeleteModalVisible(false);
      setDeleteTransactionId(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      setError(
        error.response
          ? error.response.data.message
          : "Failed to delete transaction"
      );
      setDeleteModalVisible(false);
    }
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between max-w-5xl m-4">
        <h1 className="text-2xl font-bold">Transaction</h1>
        <button
          type="button"
          onClick={() => setModalVisible(true)}
          className="px-3 text-xs font-bold text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
        >
          + Transaction
        </button>
      </div>

      {/* Modal for Create/Update */}
      {modalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  {currentTransaction
                    ? "Update Transaction"
                    : "Create Transaction"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center"
                  onClick={() => setModalVisible(false)}
                >
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleModalSubmit} className="p-4">
                <div className="grid gap-4 mb-4 grid-cols-1">
                  <div>
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      defaultValue={
                        currentTransaction ? currentTransaction.description : ""
                      }
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="type"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Type
                    </label>
                    <select
                      name="type"
                      id="type"
                      defaultValue={
                        currentTransaction ? currentTransaction.type : "expense"
                      } // Set default value to "expense"
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 w-full"
                    >
                      <option value="expense">Expense</option>
                      <option value="income">Income</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="amount"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Amount
                    </label>
                    <input
                      type="number"
                      name="amount"
                      id="amount"
                      defaultValue={
                        currentTransaction ? currentTransaction.amount : ""
                      }
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 w-full"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="date"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      id="date"
                      defaultValue={
                        currentTransaction
                          ? new Date(currentTransaction.date)
                              .toISOString()
                              .slice(0, 10)
                          : ""
                      }
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2 w-full"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-4 py-2"
                >
                  {currentTransaction
                    ? "Update Transaction"
                    : "Create Transaction"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Delete Confirmation */}
      {deleteModalVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md">
            <div className="bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Delete Transaction
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center"
                  onClick={() => setDeleteModalVisible(false)}
                >
                  <svg
                    className="w-3 h-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="text-gray-700">
                  Apakah Anda yakin ingin menghapus transaksi ini?
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    onClick={confirmDelete}
                  >
                    Hapus
                  </button>
                  <button
                    className="px-4 py-2 text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-300 ml-2"
                    onClick={() => setDeleteModalVisible(false)}
                  >
                    Batal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Displaying Transactions */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Amount</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center">
                  No transactions available.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="py-2 px-4 border-b">
                    {transaction.description}
                  </td>
                  <td className="py-2 px-4 border-b">{transaction.type}</td>
                  <td className="py-2 px-4 border-b">{transaction.amount}</td>
                  <td className="py-2 px-4 border-b">
                    {new Date(transaction.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <div className="relative">
                      <button
                        onClick={() => togglePopover(transaction.id)}
                        className="text-gray-500 hover:text-gray-900 focus:outline-none"
                      >
                        <FaEllipsisV />
                      </button>
                      {popoverVisible === transaction.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg">
                          <button
                            onClick={() => handleEdit(transaction.id)}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="block px-4 py-2 text-red-600 hover:bg-red-100 w-full text-left"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
};

export default Transactions;
