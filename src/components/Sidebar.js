import React, { useState } from "react";
import { FaClipboardList } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";
import { MdDashboardCustomize } from "react-icons/md";

const Sidebar = () => {
  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-56 h-screen pt-20 transition-transform -translate-x-full bg-white border-r sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white ">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/dashboard"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-300 group"
              >
                <MdDashboardCustomize />
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/transactions"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-300 group"
              >
                <FaClipboardList />
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Transaction
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-300 group"
                onClick={() => {
                  localStorage.removeItem("x-access-token");
                  window.location.href = "/login";
                }}
              >
                <FaSignOutAlt />
                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
