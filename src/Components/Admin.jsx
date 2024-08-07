import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../FirebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";

const ADMIN_EMAILS = ["admin@example.com", "admin2@example.com", "admin3@example.com"]; // Replace with your admin emails

const Admin = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setUserRole(ADMIN_EMAILS.includes(user.email) ? "Admin" : "User");
      } else {
        setUser(null);
        setUserRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const closeDropdown = () => setIsDropdownOpen(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      closeDropdown();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="relative text-6xl text-black lg:ml-64">
      <button onClick={toggleDropdown} className="underline">
        <img className="w-10 lg:w-12" src="/admin.png" alt="Admin" />
      </button>
      {isDropdownOpen && (
        <div className="absolute mt-2 right-0 bg-white p-4 rounded-lg shadow-lg z-50 w-64">
          <h2 className="text-xl mb-2 text-center">{userRole} Panel</h2>
          {user && (
            <div className="mb-4 text-center">
              <p className="text-sm">Email: {user.email}</p>
            </div>
          )}
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleLogout}
              className="w-20 bg-red-500 text-base text-white py-2 rounded mt-2"
            >
              Logout
            </button>
            <button
              onClick={closeDropdown}
              className="w-20 text-base bg-blue-500 text-white py-2 rounded mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
