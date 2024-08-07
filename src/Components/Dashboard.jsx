import React, { useState, useEffect } from "react";
import { db } from "../FirebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import { FaUserCheck, FaUserClock, FaUsers, FaUserAlt } from "react-icons/fa";
import Admin from "./Admin";
import Search from "./Search";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

const Dashboard = () => {
  const [visitorData, setVisitorData] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    trendData: [],
    totalVisitors: 0,
    activityData: {},
  });

  useEffect(() => {
    const fetchVisitorData = async () => {
      const visitorsCollection = collection(db, "visitors");
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      const todayQuery = query(
        visitorsCollection,
        where("timestamp", ">=", startOfDay)
      );
      const weekQuery = query(
        visitorsCollection,
        where("timestamp", ">=", startOfWeek)
      );
      const monthQuery = query(
        visitorsCollection,
        where("timestamp", ">=", startOfMonth)
      );

      const [todaySnapshot, weekSnapshot, monthSnapshot] = await Promise.all([
        getDocs(todayQuery),
        getDocs(weekQuery),
        getDocs(monthQuery),
      ]);

      const totalVisitorsSnapshot = await getDocs(visitorsCollection);
      const activityData = await getActivityData(visitorsCollection);

      setVisitorData({
        today: todaySnapshot.size,
        thisWeek: weekSnapshot.size,
        thisMonth: monthSnapshot.size,
        trendData: await getTrendData(visitorsCollection),
        totalVisitors: totalVisitorsSnapshot.size,
        activityData,
      });
    };

    const getTrendData = async (visitorsCollection) => {
      const trendQuery = query(
        visitorsCollection,
        where(
          "timestamp",
          ">=",
          new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        )
      );
      const trendSnapshot = await getDocs(trendQuery);

      const data = [];
      trendSnapshot.forEach((doc) => {
        const date = new Date(doc.data().timestamp.seconds * 1000);
        const day = date.getDate();
        if (!data[day]) data[day] = 0;
        data[day]++;
      });

      return data;
    };

    const getActivityData = async (visitorsCollection) => {
      const activitySnapshot = await getDocs(visitorsCollection);
      const activityData = {};

      activitySnapshot.forEach((doc) => {
        const department = doc.data().department || "Unknown";
        if (!activityData[department]) activityData[department] = 0;
        activityData[department]++;
      });

      return activityData;
    };

    fetchVisitorData();
  }, []);

  const trendChartData = {
    labels: visitorData.trendData.map((_, index) => index + 1),
    datasets: [
      {
        label: "Visitors",
        data: visitorData.trendData,
        backgroundColor: [
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };

  const trendChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "Visitor Trends",
        font: {
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} visitors`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 16,
          weight: "bold",
        },
        bodyFont: {
          size: 14,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      x: {
        grid: {
          color: "rgba(200, 200, 200, 0.2)",
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutBounce",
    },
  };

  const activityChartData = {
    labels: Object.keys(visitorData.activityData),
    datasets: [
      {
        data: Object.values(visitorData.activityData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const activityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      title: {
        display: true,
        text: "Activity Breakdown",
        font: {
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw} visitors`;
          },
        },
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 16,
          weight: "bold",
        },
        bodyFont: {
          size: 14,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: "easeInOutBounce",
    },
  };

  return (
    <>
      <div className="relative bg-stone-800 h-16 ml-100 lg:ml-0 p-4 lg:w-full">
        <h1 className="lg:text-2xl hidden lg:inline font-bold text-white">
          Dashboard
        </h1>
        <div className="absolute top-0 right-0 flex items-center space-x-12 pr-2 lg:pr-56">
          <Search />
          <Admin />
        </div>
      </div>
      <div className="min-h-screen ml-100 pb-20 lg:ml-0 bg-gray-200 flex flex-col items-center">
        <div className="lg:flex-grow lg:w-full">
          <div className="bg-white p-6 rounded-lg mt-10 lg:mr-5 lg:ml-5 shadow-md mb- lg:flex lg:justify-between lg:items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 ml-3 lg:ml-0 md:grid-cols-2 gap-5 lg:w-2/3">
              <div className="bg-white text-black lg:ml-10 p-4 h-44 w-72 rounded-lg shadow-md shadow-gray-400 flex items-center justify-between">
                <div className="mb-5">
                  <FaUserCheck className="text-4xl  text-blue-500" />
                  <h2 className="text-xl mt-8 text-gray-700 font-bold">
                    Visitors Today
                  </h2>
                  <p className="text-4xl">{visitorData.today}</p>
                </div>
              </div>
              <div className="bg-white text-black p-4 h-44 w-72 rounded-lg shadow-md shadow-gray-400 flex items-center justify-between">
                <div className="mb-5">
                  <FaUserClock className="text-4xl text-green-500" />
                  <h2 className="text-xl mt-8 text-gray-700 font-bold">
                    Visitors This Week
                  </h2>
                  <p className="text-4xl">{visitorData.thisWeek}</p>
                </div>
              </div>
              <div className="bg-white text-black lg:ml-10 p-4 h-44 w-72 rounded-lg shadow-md shadow-gray-400 flex items-center justify-between">
                <div className="mb-5">
                  <FaUsers className="text-4xl text-purple-500" />
                  <h2 className="text-xl mt-8 text-gray-700 font-bold">
                    Visitors This Month
                  </h2>
                  <p className="text-4xl">{visitorData.thisMonth}</p>
                </div>
              </div>
              <div className="bg-white text-black p-4 h-44 w-72 rounded-lg shadow-md shadow-gray-400 flex items-center justify-between">
                <div className="mb-5">
                  <FaUserAlt className="text-4xl text-red-500" />
                  <h2 className="text-xl mt-8 font-bold text-gray-700">
                    Total Visitors
                  </h2>
                  <p className="text-4xl">{visitorData.totalVisitors}</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/3 mt-10 lg:mt-0 pb-5 border shadow-gray-400 rounded-xl shadow-lg ">
              <h2 className="text-xl font-bold mb-4 mt-5 text-center">
                Visitors Activity
              </h2>
              <div className="h-64">
                <Pie data={activityChartData} options={activityChartOptions} />
              </div>
            </div>
          </div>
          <div className="bg-white  p-4 lg:w-100 lg:ml-24 lg:mb-20 shadow-lg shadow-gray-400">
            <h2 className="text-xl font-bold mb-4 text-center">
              Visitor Trends
            </h2>
            <div className="h-80">
              <Bar data={trendChartData} options={trendChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
