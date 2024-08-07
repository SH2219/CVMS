import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ADMIN_EMAILS = [
  "admin@example.com",
  "admin2@example.com",
  "admin3@example.com",
]; // Replace with your admin emails

const Employees = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [employees, setEmployees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if user is admin

  // Sorting state
  const [sortColumn, setSortColumn] = useState("name"); // Default sort column
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();

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
        id: doc.id,
        ...doc.data(),
      }));
      setDepartments(departmentsData);
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Error fetching departments.");
    }
  };

  const fetchEmployees = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const employeesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).filter(employee => employee.name && employee.department); // Filter out empty entries

      // Sort employees data
      setEmployees(sortData(employeesData));
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Error fetching employees.");
    }
  };

  const sortData = (data) => {
    return data.sort((a, b) => {
      if (sortColumn === "name" || sortColumn === "department") {
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
      return 0; // Default to no sorting for other columns
    });
  };

  const handleSort = (column) => {
    const newDirection = sortColumn === column && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(column);
    setSortDirection(newDirection);
    setEmployees(sortData([...employees]));
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();

    if (employeeName.trim() === "" || selectedDepartment === "") {
      toast.warn("Please enter an employee name and select a department");
      return;
    }

    if (isEditing) {
      try {
        const employeeDoc = doc(db, "users", editEmployeeId);
        await updateDoc(employeeDoc, { name: employeeName, department: selectedDepartment });
        setEmployees(employees.map(emp => emp.id === editEmployeeId ? { ...emp, name: employeeName, department: selectedDepartment } : emp));
        toast.success("Employee updated successfully");
        setIsEditing(false);
        setEditEmployeeId(null);
      } catch (error) {
        console.error("Error updating employee:", error);
        toast.error("Failed to update employee");
      }
    } else {
      try {
        const newEmployee = {
          name: employeeName,
          department: selectedDepartment,
        };
        console.log("Adding new employee:", newEmployee);
        const docRef = await addDoc(collection(db, "users"), newEmployee);
        console.log("Document written with ID: ", docRef.id);
        toast.success("Employee added successfully");
        setEmployees(sortData([...employees, { id: docRef.id, ...newEmployee }]));
      } catch (error) {
        console.error("Error adding employee:", error);
        console.error("Error details:", error.message);
        toast.error(`Failed to add employee: ${error.message}`);
      }
    }

    setEmployeeName("");
    setSelectedDepartment("");
  };

  const handleEdit = (employee) => {
    setIsEditing(true);
    setEditEmployeeId(employee.id);
    setEmployeeName(employee.name);
    setSelectedDepartment(employee.department);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      setEmployees(employees.filter(employee => employee.id !== id));
      toast.success("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      toast.error("Failed to delete employee");
    }
  };

  return (
    <>
      <div className="container w-80 lg:w-full mt-12 px-4 lg:ml-0 ml-100 lg:mx-auto">
        {isAdmin && (
          <section className="p-6 bg-white w-80 ml-9 lg:ml-0 lg:w-full shadow-lg border rounded-2xl border-gray-300 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-black">{isEditing ? "Edit Employee" : "Add Employee"}</h2>
            <form onSubmit={handleAddEmployee} className="space-y-4">
              <input
                type="text"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="Employee Name"
                className="w-full px-4 py-2 border rounded"
              />
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              >
                <option value="">Select Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.name}>
                    {department.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {isEditing ? "Update Employee" : "Add Employee"}
              </button>
            </form>
          </section>
        )}
        {employees.length > 0 && (
          <section className="p-6 bg-white w-80 ml-9 lg:ml-0 lg:w-full shadow-lg border rounded-2xl border-gray-300">
            <h2 className="text-2xl font-bold mb-4 text-black">Employee List</h2>
            <div className="overflow-x-auto">
              <table className="lg:w-full shadow-xl rounded-2xl overflow-hidden border-collapse border">
                <thead>
                  <tr className="bg-gray-200">
                    {["name", "department"].map((header) => (
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
                  {employees.map((employee) => (
                    <tr key={employee.id} className="bg-white">
                      <td className="border p-2">{employee.name}</td>
                      <td className="border p-2">{employee.department}</td>
                      {isAdmin && (
                        <td className="border p-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
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
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Employees;
