import React, { useState } from "react";
import { auth, db } from "../FirebaseConfig";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../App.css";

const ADMIN_EMAILS = ["admin@example.com", "admin2@example.com", "admin3@example.com"]; // Replace with your admin emails

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const isAdmin = ADMIN_EMAILS.includes(user.email);

      // Save user data to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: isAdmin ? 'admin' : 'user'
      });

      // Redirect to login page
      navigate('/login');
      toast.success("Registration successful! Please log in.");
    } catch (error) {
      console.error("SignUp Error: ", error);
      setError("Failed to register. Please check your email and password.");
      toast.error("Failed to register. Please check your email and password.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-200 min-h-screen">
      <div className="w-full max-w-md p-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-500">
          <h2 className="text-3xl font-extrabold text-gray-900 ">
            Create
          </h2>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-">
            Account
          </h2>
          <form onSubmit={handleSignUp} className="space-y-16">
            <div className="space-y-5">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-b border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-b border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-b border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Confirm Password"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-center items-center w-full h-full">
                <button
                  type="submit"
                  className="w-40 bg-black text-2xl flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-gray-900 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Let's Go
                </button>
              </div>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </form>
          <div className="mt-6">
            <Link
              to="/login"
              className="text-indigo-600 text-base hover:text-indigo-500 "
            >
              Already have an account? <span className="text-lg text-black font-medium">Login</span>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Register;
