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
                      }
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
                  Are you sure you want to delete this transaction?
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                    onClick={confirmDelete}
                  >
                    Confirm
                  </button>
                  <button
                    className="px-4 py-2 text-gray-500 bg-gray-200 rounded-lg hover:bg-gray-300 ml-2"
                    onClick={() => setDeleteModalVisible(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Displaying Transactions */}
      <div className="mt-5">
        <div className="flex justify-between max-w-5xl m-4 ">
          <table className="w-full text-sm text-left rtl:text-right text-gray-700 rounded-lg bg-white shadow-md">
            <thead className="text-xs text-gray-800 uppercase bg-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr className="odd:bg-white even:bg-gray-50 border-b">
                  <td colSpan="5" className="py-4 text-center text-gray-500">
                    No transactions available.
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="odd:bg-white even:bg-gray-50 border-b"
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {transaction.description}
                    </th>
                    <td className="flex items-center px-6 py-4">
                      <button
                        type="button"
                        className={`py-1 px-2 text-xs font-medium text-center text-gray-600 rounded-lg ${
                          transaction.type === "income"
                            ? "border-2 border-emerald-600"
                            : "border-2 border-rose-700"
                        }`}
                      >
                        {transaction.type === "income" ? "Income" : "Expense"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      }).format(transaction.amount)}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <button
                          onClick={() => togglePopover(transaction.id)}
                          className="text-gray-500 hover:text-gray-900 focus:outline-none"
                        >
                          <FaEllipsisV />
                        </button>
                        {popoverVisible === transaction.id && (
                          <div className="fixed right-20 w-32 bg-white border border-gray-300 rounded shadow-lg">
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
    </div>
  );
};

export default Transactions;
