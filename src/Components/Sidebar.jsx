import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UserIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const linkStyles = "flex items-center border-b text-xl border-gray-300 py-7";
  const activeLinkStyles = "pl-5 text-lg text-gray-400";

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg lg:hidden"
      >
        {isOpen ? (
          <XMarkIcon className="w-6 h-6 text-white" />
        ) : (
          <Bars3Icon className="w-12 h-7 text-black " />
        )}
      </button>
      <div
        className={`fixed top-0 left-0 h-full text-white transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:w-64 w-64 z-40 bg-black bg-cover bg-center`}
      >
        <div className="flex flex-col h-full bg-black bg-opacity-50">
          <button
            onClick={toggleSidebar}
            className="p-4 hover:bg-gray-600 transition-colors duration-300 ease-in-out lg:hidden"
          >
            {isOpen ? "<" : ">"}
          </button>
          <NavLink to={"/dashboard"} className="text-3xl ml-5 lg:text-4xl lg:pt-10 font-bold">
            CVMS
          </NavLink>
          <div className="lg:flex-1 p-4 pt-6">
            <ul>
              <li>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `${linkStyles} ${isActive ? activeLinkStyles : ""}`
                  }
                >
                  <div className="hover:ml-5 flex text-xl transition-all delay-150 hover:text-gray-400 hover:text-lg">
                    <HomeIcon className="w-6 h-6 mr-4" />
                    <span className="lg:inline">Dashboard</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/visitors"
                  className={({ isActive }) =>
                    `${linkStyles} ${isActive ? activeLinkStyles : ""}`
                  }
                >
                  <div className="hover:ml-5 flex transition-all delay-150 hover:text-gray-400 hover:text-lg">
                    <UserIcon className="w-6 h-6 mr-4" />
                    <span className="lg:inline">Visitors</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/visitorma"
                  className={({ isActive }) =>
                    `${linkStyles} ${isActive ? activeLinkStyles : ""}`
                  }
                >
                  <div className="hover:ml-5 flex transition-all delay-150 hover:text-gray-400 hover:text-lg">
                    <UserGroupIcon className="w-6 h-6 mr-4" />
                    <span className="lg:inline">Visitor Management</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/department"
                  className={({ isActive }) =>
                    `${linkStyles} ${isActive ? activeLinkStyles : ""}`
                  }
                >
                  <div className="hover:ml-5 flex transition-all delay-150 hover:text-gray-400 hover:text-lg">
                    <BuildingOfficeIcon className="w-6 h-6 mr-4" />
                    <span className="lg:inline">Departments</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/employees"
                  className={({ isActive }) =>
                    `${linkStyles} ${isActive ? activeLinkStyles : ""}`
                  }
                >
                  <div className="hover:ml-5 flex transition-all delay-150 hover:text-gray-400 hover:text-lg">
                    <BuildingOfficeIcon className="w-6 h-6 mr-4" />
                    <span className="lg:inline">Employees</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Bw"
                  className={({ isActive }) =>
                    `${linkStyles} ${isActive ? activeLinkStyles : ""}`
                  }
                >
                  <div className="hover:ml-5 flex transition-all delay-150 hover:text-gray-400 hover:text-lg">
                    <CalendarIcon className="w-6 h-6 mr-4" />
                    <span className="lg:inline">B/W Dates</span>
                  </div>
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/pass"
                  className={({ isActive }) =>
                    `${linkStyles} ${isActive ? activeLinkStyles : ""}`
                  }
                >
                  <div className="hover:ml-5 flex transition-all delay-150 hover:text-gray-400 hover:text-lg">
                    <CalendarIcon className="w-6 h-6 mr-4" />
                    <span className="lg:inline">Visitors Pass</span>
                  </div>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
