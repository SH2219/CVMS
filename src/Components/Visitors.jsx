import React, { useState, useEffect } from "react";
import { db } from "../FirebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "./Search";
import Admin from "./Admin";

const Visitors = () => {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [purpose, setPurpose] = useState("");
  const [department, setDepartment] = useState("");
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const querySnapshot = await getDocs(collection(db, "departments"));
      setDepartments(querySnapshot.docs.map((doc) => doc.data().name));
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "visitors"), {
        name,
        number,
        email,
        address,
        purpose,
        department,
        timestamp: new Date(),
      });
      setName("");
      setNumber("");
      setEmail("");
      setAddress("");
      setPurpose("");
      setDepartment("");
      toast.success("Visitor added successfully!");
    } catch (error) {
      console.error("Error adding visitor: ", error);
      toast.error("Error adding visitor.");
    }
  };

  return (
    <>
      {/* <div className="relative bg-stone-800 ml-100 h-16 overflow-hidden lg:ml-0 p-4 lg:w-full">
        <h1 className="lg:text-2xl pl-64 hidden lg:inline font-bold ">
          Visitors
        </h1>
        <div className="absolute top-0 right-0 flex items-center space-x-12 pr-2 lg:pr-56">
          <Search />
          <Admin />
        </div>
      </div> */}
      <div className="flex justify-center ml-100 lg:ml-0 mt-12  items-center h-full p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-transparent p-6 lg:pl-24 pb-20 pt-20 bg-gray-200 shadow-lg rounded-3xl border-black border  w-full max-w-lg lg:max-w-2xl"
        >
          <h2 className="text-2xl font-bold mb-4">Add Visitor</h2>
          <div className="flex gap-5">
            <div className="mb-4">
              <label className="block text-left text-gray-800 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded-lg shadow-md bg-transparent "
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-gray-800 mb-1">
                Number
              </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full p-2 border border-gray-700 shadow-md rounded-lg bg-transparent"
                required
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="mb-4">
              <label className="block text-left text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-700 shadow-md rounded-lg bg-transparent"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-gray-800 mb-1">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border border-gray-700 shadow-md rounded-lg bg-transparent"
                required
              />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="mb-4">
              <label className="block text-left text-gray-800 mb-1">
                Purpose
              </label>
              <input
                type="text"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full p-2 border border-gray-700 shadow-md  rounded-lg bg-transparent"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left text-gray-800 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-2 border border-gray-700 shadow-md bg-gray-200 rounded-lg bg-transparent"
                required
              >
                <option value="" className="text-black ">
                  Select Department
                </option>
                {departments.map((dept, index) => (
                  <option
                    key={index}
                    value={dept}
                    className="text-black bg-transparent"
                  >
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="bg-black hover:bg-gray-800 transition-all delay-100 text-white p-2 rounded-md">
            Submit
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Visitors;
