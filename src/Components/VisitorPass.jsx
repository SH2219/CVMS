import React, { useEffect, useState, useRef } from 'react';
import { db } from '../FirebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import Search from './Search';
import Admin from './Admin';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VisitorPass = () => {
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const visitorsCollection = collection(db, 'visitors');
        const visitorSnapshot = await getDocs(visitorsCollection);
        const visitorList = visitorSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVisitors(visitorList);
      } catch (error) {
        console.error("Error fetching visitors: ", error);
        toast.error("Failed to load visitors.");
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const handlePrint = useReactToPrint({
    content: () => {
      console.log("Printing content:", componentRef.current); // Debugging line
      return componentRef.current;
    },
    documentTitle: 'Visitor Pass',
    onAfterPrint: () => toast.success("Pass printed successfully!"),
  });

  const handleGeneratePass = (visitor) => {
    setSelectedVisitor(visitor);
    toast.info(`Pass generated for ${visitor.name}`);
  };

  const calculateExpiryDate = (timestamp) => {
    const expiryDate = new Date(timestamp.seconds * 1000);
    expiryDate.setHours(expiryDate.getHours() + 2); // Set the pass to expire in 2 hours
    return expiryDate;
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="flex flex-col items-center ml-100 lg:ml-0 pt-20  w-full p-4">
        <div className="lg:w-full w-80 ml-32 lg:ml-0 max-w-5xl mb-8  bg-white shadow-lg border border-gray-300 rounded-2xl p-6">
          <h1 className="text-2xl font-bold mb-4 ">Visitor Pass Management</h1>
          <div className="shadow-lg overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Number</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(visitor => (
                  <tr key={visitor.id} className="bg-white">
                    <td className="border p-2">{visitor.name}</td>
                    <td className="border p-2">{visitor.number}</td>
                    <td className="border p-2">{visitor.email}</td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleGeneratePass(visitor)}
                        className="bg-blue-500 text-white p-2 rounded"
                      >
                        Generate Pass
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {selectedVisitor && (
          <div className="w-full max-w-4xl p-4 border rounded-2xl shadow-lg bg-white" ref={componentRef}>
            <h2 className="text-xl font-bold mb-4 text-center">Visitor Pass</h2>
            <div className="mb-4">
              <p><strong>Name:</strong> {selectedVisitor.name}</p>
              <p><strong>Number:</strong> {selectedVisitor.number}</p>
              <p><strong>Email:</strong> {selectedVisitor.email}</p>
              <p><strong>Address:</strong> {selectedVisitor.address}</p>
              <p><strong>Purpose:</strong> {selectedVisitor.purpose}</p>
              <p><strong>Department:</strong> {selectedVisitor.department}</p>
              <p><strong>Timestamp:</strong> {new Date(selectedVisitor.timestamp.seconds * 1000).toLocaleString()}</p>
              <p><strong>Expiry:</strong> {calculateExpiryDate(selectedVisitor.timestamp).toLocaleString()}</p>
            </div>
            <button
              onClick={handlePrint}
              className="bg-blue-500 text-white p-2 rounded mt-4 w-full sm:w-auto"
            >
              Print Pass
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default VisitorPass;
