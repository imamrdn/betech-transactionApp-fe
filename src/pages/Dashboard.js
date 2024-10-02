import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    const token = localStorage.getItem("x-access-token");
    if (!token) {
      setError("Token tidak ditemukan. Silakan login.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/transactions/balance",
        {
          headers: {
            "x-access-token": token,
          },
        }
      );
      setBalance(response.data.balance);
      setLoading(false);
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "Gagal mengambil data balance"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <>
      <div className="mt-5">
        <div className="flex justify-between max-w-5xl m-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </div>

      <div className="max-w-full m-4 rounded-lg">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Menampilkan Balance */}
          <div className="flex flex-col justify-center h-24 rounded bg-gray-50 shadow-lg px-4">
            <p className="text-md text-gray-700">Balance</p>

            {/* Kondisi Loading, Error, dan Data Balance */}
            {loading ? (
              <p className="text-2xl text-gray-700 font-bold">Loading...</p>
            ) : error ? (
              <p className="text-2xl text-red-500">{error}</p>
            ) : (
              <p className="text-2xl text-gray-700 font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(balance)}
              </p>
            )}
          </div>

          {/* Kartu lainnya (placeholder) */}
          <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </p>
          </div>

          <div className="flex items-center justify-center h-24 rounded bg-gray-50 dark:bg-gray-800">
            <p className="text-2xl text-gray-400 dark:text-gray-500">
              <svg
                className="w-3.5 h-3.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 18 18"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 1v16M1 9h16"
                />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
