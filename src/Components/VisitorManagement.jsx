import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADMIN_EMAILS = [
  "admin@example.com",
  "admin2@example.com",
  "admin3@example.com",
]; // Replace with your admin emails

const VisitorManagement = () => {
  const [visitors, setVisitors] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin
  const [sortColumn, setSortColumn] = useState("timestamp"); // Default sort column
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction

  useEffect(() => {
    fetchVisitors();

    // Check if the user is admin
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Check if the user's email is in the admin emails array
        setIsAdmin(ADMIN_EMAILS.includes(user.email));
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, []);

  const fetchVisitors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "visitors"));
      const visitorsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setVisitors(sortData(visitorsData));
    } catch (error) {
      console.error("Error fetching visitors:", error);
    }
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (sortColumn === "timestamp") {
        // Handle sorting for timestamps
        const aDate = new Date(a[sortColumn]?.seconds * 1000);
        const bDate = new Date(b[sortColumn]?.seconds * 1000);
        return sortDirection === "asc"
          ? aDate - bDate
          : bDate - aDate;
      } else {
        // Handle alphabetical sorting
        const aValue = a[sortColumn]?.toLowerCase() || "";
        const bValue = b[sortColumn]?.toLowerCase() || "";
        if (aValue < bValue) {
          return sortDirection === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      }
    });
  };

  const handleSort = (column) => {
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
    setVisitors(sortData([...visitors]));
  };

  const handleDeleteVisitor = async (id) => {
    try {
      await deleteDoc(doc(db, "visitors", id));
      toast.success("Visitor deleted successfully");
      fetchVisitors();
    } catch (error) {
      console.error("Error deleting visitor:", error);
      toast.error("Failed to delete visitor");
    }
  };

  return (
    <>
      <div className="container w-80 lg:w-full mt-12 px-4 lg:ml-0 ml-100 lg:mx-auto">
        <section className="p-6 bg-white w-80 ml-9 lg:ml-0 lg:w-full shadow-lg border rounded-2xl border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Visitor List</h2>
          <div className="overflow-x-auto">
            <table className="lg:w-full shadow-xl rounded-2xl overflow-hidden border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  {["name", "number", "email", "address", "purpose", "department", "timestamp"].map((header) => (
                    <th
                      key={header}
                      className="border p-2 cursor-pointer"
                      onClick={() => handleSort(header)}
                    >
                      {header.charAt(0).toUpperCase() + header.slice(1)}
                      {sortColumn === header && (
                        <span className={`ml-2 ${sortDirection === "asc" ? "text-gray-700" : "text-gray-400"}`}>
                          {sortDirection === "asc" ? "▲" : "▼"}
                        </span>
                      )}
                    </th>
                  ))}
                  {isAdmin && <th className="border p-2">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {visitors.map((visitor) => (
                  <tr key={visitor.id} className="bg-white">
                    <td className="border p-2">{visitor.name}</td>
                    <td className="border p-2">{visitor.number}</td>
                    <td className="border p-2">{visitor.email}</td>
                    <td className="border p-2">{visitor.address}</td>
                    <td className="border p-2">{visitor.purpose}</td>
                    <td className="border p-2">{visitor.department}</td>
                    <td className="border p-2">
                      {new Date(visitor.timestamp.seconds * 1000).toLocaleString()}
                    </td>
                    {isAdmin && (
                      <td className="border p-2">
                        <button
                          onClick={() => handleDeleteVisitor(visitor.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <ToastContainer />
    </>
  );
};

export default VisitorManagement;
