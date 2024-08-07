import React from "react";
import { Link } from "react-router-dom";
const Landing = () => {
  return (
    <div>
      <div className="flex justify-between items-center pt-6 pb-6 w-full">
        <div className=" text-3xl lg:text-5xl ml-24 font-bold">
          CVMS
        </div>
        <div className="flex">
          <div className="bg-black rounded-3xl w-32 lg:w-40 p-2 mr-4 flex items-center justify-center">
            <Link
              className="text-violet-500 text-center text-xl lg:text-2xl font-bold hover:text-violet-700 transition-all delay-100"
              to={"/login"}
            >
              Login
            </Link>
          </div>
          <div className="bg-black rounded-3xl w-32 mr-12 lg:w-40 p-2 flex items-center justify-center">
            <Link
              className="text-violet-500 text-center text-xl lg:text-2xl font-bold hover:text-violet-700 transition-all delay-100"
              to={"/register"}
            >
              Register
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:justify-end items-center">
        <h1 className="text-center lg:mr-8 font-extrabold text-2xl lg:text-6xl">
          WELCOME, TO COMPANY VISITOR MANAGEMENT SYSTEM
        </h1>
        <img className="lg:mr-48 lg:w-98 " src="/landing.jpg" alt="" />
      </div>
    </div>
  );
};

export default Landing;
