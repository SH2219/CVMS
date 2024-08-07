import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, startAt, endAt } from 'firebase/firestore';
import { db } from '../FirebaseConfig';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [visitorDetails, setVisitorDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      setVisitorDetails([]);
      setIsModalOpen(false);
      return;
    }

    try {
      const visitorsRef = collection(db, 'visitors');
      const q = query(
        visitorsRef,
        orderBy('name'),
        startAt(value),
        endAt(value + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const visitorData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVisitorDetails(visitorData);
        setIsModalOpen(true);
      } else {
        setVisitorDetails([]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error fetching visitor details:', error);
      setVisitorDetails([]);
      setIsModalOpen(false);
    }
  };

  const formatTimestamp = (seconds) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleString();
  };

  const handleClick = (id) => {
    // Navigate to Visitor Management page with the visitor's ID as a query parameter
    navigate(`/visitorma?id=${id}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search visitors"
        className="w-full lg:px-28 py-2 text-white bg-gradient-bg rounded-full"
      />
      {isModalOpen && visitorDetails.length > 0 && (
        <div className="absolute top-12 left-0 right-0 bg-white p-4 rounded-lg shadow-lg z-100">
          <h2 className="text-xl mb-2">Visitor Details</h2>
          {visitorDetails.map(visitor => (
            <div key={visitor.id} className="mb-4">
              <p><strong>Name:</strong> {visitor.name}</p>
              <p><strong>Email:</strong> {visitor.email}</p>
              <p><strong>Phone:</strong> {visitor.phone}</p>
              {visitor.timestamp && (
                <p><strong>Visit Date:</strong> {formatTimestamp(visitor.timestamp.seconds)}</p>
              )}
              <button
                onClick={() => handleClick(visitor.id)}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
              >
                Go to Visitor Management
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;
