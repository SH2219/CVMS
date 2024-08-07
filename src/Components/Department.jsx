import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Admin from "./Admin";
import Search from "./Search";

const ADMIN_EMAILS = [
  "admin@example.com",
  "admin2@example.com",
  "admin3@example.com",
]; // Replace with your admin emails

const Department = () => {
  const [departmentName, setDepartmentName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [editing, setEditing] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState({
    id: null,
    name: "",
  });
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

  useEffect(() => {
    fetchDepartments();

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

  const fetchDepartments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "departments"));
      const departmentsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();

    if (departmentName.trim() === "") {
      alert("Please enter a department name");
      return;
    }

    try {
      await addDoc(collection(db, "departments"), {
        name: departmentName,
        createdAt: new Date(),
      });
      alert("Department added successfully");
      setDepartmentName("");
      fetchDepartments();
    } catch (error) {
      console.error("Error adding department:", error);
      alert("Failed to add department");
    }
  };

  const handleEditDepartment = async (e) => {
    e.preventDefault();

    if (currentDepartment.name.trim() === "") {
      alert("Please enter a department name");
      return;
    }

    try {
      const departmentRef = doc(db, "departments", currentDepartment.id);
      await updateDoc(departmentRef, {
        name: currentDepartment.name,
      });
      alert("Department updated successfully");
      setEditing(false);
      setCurrentDepartment({ id: null, name: "" });
      fetchDepartments();
    } catch (error) {
      console.error("Error updating department:", error);
      alert("Failed to update department");
    }
  };

  const handleDeleteDepartment = async (id) => {
    try {
      await deleteDoc(doc(db, "departments", id));
      alert("Department deleted successfully");
      fetchDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
      alert("Failed to delete department");
    }
  };

  const startEdit = (department) => {
    setEditing(true);
    setCurrentDepartment(department);
  };

  return (
    <>
      {/* <div className="relative ml-100 lg:ml-0 bg-stone-800 h-16 p-4 lg:w-full">
        <h1 className="text-2xl font-bold text-white hidden lg:inline-block">Department</h1>
        <div className="absolute top-0 right-0 flex items-center space-x-4 pr-4">
          <Search />
          <Admin />
        </div>
      </div> */}
      <div className="container w-80 lg:w-full mt-12 px-4 lg:ml-0 ml-100 lg:mx-auto">
        {isAdmin && (
          <section className="mb-8 p-10 w-80 lg:w-full ml-8 lg:ml-0 bg-white shadow-lg border rounded-2xl border-gray-300">
            <h2 className="text-2xl font-bold mb-4">
              {editing ? "Edit Department" : "Add Department"}
            </h2>
            <form
              onSubmit={editing ? handleEditDepartment : handleAddDepartment}
              className="space-y-6"
            >
              <input
                type="text"
                value={editing ? currentDepartment.name : departmentName}
                onChange={(e) =>
                  editing
                    ? setCurrentDepartment({
                        ...currentDepartment,
                        name: e.target.value,
                      })
                    : setDepartmentName(e.target.value)
                }
                placeholder="Department Name"
                className="w-full px-4 py-2 border rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 transition-all delay-100 text-white px-4 py-2 rounded"
              >
                {editing ? "Update Department" : "Add Department"}
              </button>
            </form>
          </section>
        )}
        <section className="p-6 bg-white w-80 ml-9 lg:ml-0 lg:w-full shadow-lg border rounded-2xl border-gray-300">
          <h2 className="text-2xl font-bold mb-4">Department List</h2>
          <div className="overflow-x-auto">
            <table className="lg:w-full shadow-xl rounded-2xl overflow-hidden border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((department) => (
                  <tr key={department.id} className="bg-white">
                    <td className="border p-2">{department.name}</td>
                    <td className="border p-2">
                      {isAdmin && (
                        <>
                          <button
                            onClick={() => startEdit(department)}
                            className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDepartment(department.id)}
                            className="bg-red-500 text-white px-2 py-1 rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
};

export default Department;
