import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-2 bg-gray-100">
          <div className="sm:ml-56 sm:mt-16">
            <div className="rounded-lg">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
