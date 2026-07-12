import React, { useRef } from "react";
import axios from "axios";
import {
  User,
  Mail,
  ShieldCheck,
  FileBarChart,
  CalendarDays,
  LogOut,
  Camera,
} from "lucide-react";

export default function ProfileView({ reports = [] }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fileInputRef = useRef(null);

  const reportCount = reports.length;

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recently Joined";

  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("profile", file);

      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:5000/api/auth/profile-picture",
        formData,
        {
          headers: {
            Authorization: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      user.profilePic = res.data.profilePic;

      localStorage.setItem("user", JSON.stringify(user));

      const updatedUser = {
  ...user,
  profilePic: res.data.profilePic,
};

localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header Card */}

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 p-8">

        <div className="flex flex-col items-center">

          {/* Profile Image */}

          <div className="relative w-28 h-28">

            {user?.profilePic ? (
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-28 h-28 rounded-3xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 rounded-3xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {initials}
              </div>
            )}

            {/* Camera Button */}

            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-2 shadow-lg transition"
            >
              <Camera size={16} />
            </button>

            {/* Hidden File Input */}

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfileUpload}
              hidden
            />

          </div>

          <h1 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
            {user?.name}
          </h1>

          <p className="text-slate-500 dark:text-slate-300 mt-1">
            {user?.email}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold">
            <ShieldCheck size={16} />
            Verified Account
          </div>

        </div>

      </div>

      {/* Information */}

      <div className="mt-8 grid md:grid-cols-2 gap-6">
                {/* Account Information */}

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">

          <h2 className="text-lg font-bold mb-5">
            Account Information
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
                <User size={18} />
                <span>Name</span>
              </div>

              <span className="font-semibold text-slate-800 dark:text-white">
                {user?.name}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
                <Mail size={18} />
                <span>Email</span>
              </div>

              <span className="font-semibold text-slate-800 dark:text-white break-all">
                {user?.email}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
                <CalendarDays size={18} />
                <span>Member Since</span>
              </div>

              <span className="font-semibold text-slate-800 dark:text-white">
                {joinedDate}
              </span>
            </div>

          </div>

        </div>

        {/* Statistics */}

        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6">

          <h2 className="text-lg font-bold mb-5">
            Statistics
          </h2>

          <div className="space-y-5">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
                <FileBarChart size={18} />
                <span>Reports Analyzed</span>
              </div>

              <span className="bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-lg">
                {reportCount}
              </span>

            </div>

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
                <ShieldCheck size={18} />
                <span>Account Status</span>
              </div>

              <span className="text-emerald-600 font-semibold">
                Active
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Logout */}

      <div className="mt-8">

        <button
          onClick={handleLogout}
          className="w-full bg-gradient-to-r from-red-500 to-rose-600 text-white py-4 rounded-2xl font-semibold hover:opacity-95 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <div className="flex justify-center items-center gap-2">
            <LogOut size={18} />
            Logout
          </div>
        </button>

      </div>

    </div>
  );
}