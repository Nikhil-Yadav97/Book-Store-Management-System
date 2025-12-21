import React, { useContext } from "react";
import { UserContext } from "../../context/userContext";
import UserNavBar from "./UserNavBar";

export default function Profile() {
  const { user,logout } = useContext(UserContext);

  return (
    <>
    <UserNavBar/>
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow p-6 flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{user?.name}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-indigo-100 text-indigo-700">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard title="Total Orders" value="0" />
          <StatCard title="Amount Spent" value={0} />
          <StatCard title="Transactions" value="0" />
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-xl shadow p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <Detail label="Full Name" value={user?.name} />
            <Detail label="Email Address" value={user?.email} />
            <Detail label="Role" value={user?.role} />
            <Detail label="Joined On" value={new Date(user?.createdAt).toDateString()} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-6">
  <button className="px-4 py-2 bg-indigo-600 text-white rounded">
    My Orders
  </button>

  <button className="px-4 py-2 bg-indigo-600 text-white rounded">
    Transaction History
  </button>

  <button className="px-4 py-2 bg-indigo-600 text-white rounded">
    Edit Profile
  </button>

  <button
    onClick={logout}
    className="px-4 py-2 bg-red-500 text-white rounded"
  >
    Logout
  </button>
</div>


      </div>
    </div>
    </>
  );
}

/* Reusable Components */

const StatCard = ({ title, value }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    <p className="text-gray-500">{title}</p>
    <h3 className="text-2xl font-bold mt-2">{value}</h3>
  </div>
);

const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

const ActionButton = ({ label, danger }) => (
  <button
    className={`px-6 py-3 rounded-lg font-medium transition ${
      danger
        ? "bg-red-500 text-white hover:bg-red-600"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }`}
  >
    {label}
  </button>
);
