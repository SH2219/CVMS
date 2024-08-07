import React, { useState } from "react";
import { db } from "../FirebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import Search from "./Search";
import Admin from "./Admin";

const BwDates = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState("");

  const handleFetchVisitors = async () => {
    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    try {
      const startTimestamp = Timestamp.fromDate(new Date(startDate));
      const endTimestamp = Timestamp.fromDate(new Date(endDate));

      const q = query(
        collection(db, "visitors"),
        where("timestamp", ">=", startTimestamp),
        where("timestamp", "<=", endTimestamp)
      );

      const querySnapshot = await getDocs(q);
      const visitorsData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setVisitors(visitorsData);
      setError("");
    } catch (error) {
      console.error("Error fetching visitors: ", error);
      setError("Error fetching visitors");
    }
  };

  return (
    <>
      {/* <div className="relative bg-stone-800 ml-100 h-16 lg:ml-0 p-4 lg:w-full">
        <h1 className="lg:text-2xl hidden lg:inline font-bold text-white">
          Between Dates
        </h1>
        <div className="absolute top-0 right-0 flex items-center space-x-6 pr-6 lg:pr-56">
          <Search />
          <Admin />
        </div>
      </div> */}
      <div className="flex justify-center items-center  w-full min-h-screen p-4">
        <div className="lg:w-full max-w-4xl bg-white ml-100 mb-40 lg:ml-0 shadow-lg border border-gray-300 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-4 text-center lg:text-left">
            Visitors Between Dates
          </h1>
          <div className="mb-4">
            <label className="block text-left mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <label className="block text-left mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleFetchVisitors}
              className="bg-blue-500 text-white p-2 rounded mt-4 w-full"
            >
              Fetch Visitors
            </button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div>
            <h2 className="text-xl font-bold mb-4 text-center lg:text-left">
              Visitors List
            </h2>
            {visitors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Number</th>
                      <th className="border p-2">Email</th>
                      <th className="border p-2">Address</th>
                      <th className="border p-2">Purpose</th>
                      <th className="border p-2">Department</th>
                      <th className="border p-2">Timestamp</th>
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
                          {visitor.timestamp.toDate().toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No visitors found for the selected date range.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BwDates;
