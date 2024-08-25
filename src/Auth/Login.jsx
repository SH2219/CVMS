import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ADMIN_EMAILS = [
  "admin@example.com",
  "admin2@example.com",
  "admin3@example.com",
]; // Replace with your admin emails

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const isAdmin = ADMIN_EMAILS.includes(user.email);

      // Set user role based on email
      const userRole = isAdmin ? "admin" : "user";

      // Redirect to dashboard or another page
      navigate("/dashboard");
      toast.success("Signed in successfully");
    } catch (error) {
      console.error("SignIn Error: ", error);
      setError("Failed to sign in. Please check your email and password.");
      toast.error("Failed to sign in. Please check your email and password.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent. Please check your inbox.");
    } catch (error) {
      console.error("Password Reset Error: ", error);
      toast.error("Failed to send password reset email. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center bg-slate-200 min-h-screen">
      <div className="w-full max-w-md p-8">
        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-500">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-">Welcome</h2>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Back</h2>
          <form onSubmit={handleSignIn} className="space-y-16">
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
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border-b border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="w-40 bg-black text-2xl flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-gray-900 font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Let's Go
              </button>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-indigo-600 text-sm hover:text-indigo-500"
              >
                Forgot Password?
              </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          </form>
          <div className="mt-6">
            <Link
              to="/register"
              className="text-indigo-600 text-base hover:text-indigo-500"
            >
              Don't have an account? <span className="text-lg text-black font-medium">Register</span>
            </Link>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
