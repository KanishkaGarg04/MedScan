import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Home,
  Clock,
  User,
  Bot,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import AIHealthSummary from "./AIHealthSummary";
import RecentActivity from "./RecentActivity";
import AnalyticsCharts from "./AnalyticsCharts";
import StatsCards from "./StatsCards";
import DashboardView from "./DashboardView";
import UploadView from "./UploadView";
import HistoryView from "./HistoryView";
import ChatbotView from "./ChatbotView";
import ProfileView from "./ProfileView";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ================= Fetch Reports =================

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/reports/history`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setReports(res.data.data || res.data || []);
    } catch (err) {
      console.error(
        "Failed fetching database history collection records:",
        err
      );
    }
  };

  // ================= Initial Load =================

  useEffect(() => {
    fetchReports();

    const syncUser = () => {
      const saved = localStorage.getItem("user");

      if (saved) {
        setUser(JSON.parse(saved));
      }
    };

    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  // ================= Dark Mode =================

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // ================= Logout =================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
  <div className="flex min-h-screen bg-[#f7fafd] dark:bg-slate-900 text-slate-700 dark:text-white">

    {/* Sidebar */}
    <aside className="w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 h-screen fixed flex flex-col justify-between p-6">

      <div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white">
            <svg
              className="w-6 h-6 stroke-white fill-none"
              viewBox="0 0 24 24"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>

          <div>
            <h1 className="text-xl font-bold">MedScan</h1>
            <p className="text-xs text-slate-400">Report Analyzer</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">

          {[
            { id: "home", label: "Home", icon: Home },
            { id: "history", label: "History", icon: Clock },
            { id: "profile", label: "Profile", icon: User },
            { id: "chatbot", label: "AI Consultant", icon: Bot },
          ].map(({ id, label, icon: Icon }) => {

            const active = activeTab === id;

            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition
                ${
                  active
                    ? "bg-gradient-to-r from-teal-500 to-blue-600 text-white"
                    : "hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <Icon size={20} />
                {label}
              </button>
            );
          })}

        </nav>

      </div>

      {/* Bottom */}
      <div className="space-y-4 border-t pt-5 dark:border-slate-700">

        {/* Profile */}

        <div
          onClick={() => setActiveTab("profile")}
          className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-xl"
        >

          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt=""
              className="w-11 h-11 rounded-xl object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white flex items-center justify-center font-bold">
              {user?.name
                ?.split(" ")
                .map((w) => w[0])
                .join("")
                .toUpperCase()}
            </div>
          )}

          <div>
            <h4 className="font-semibold">{user?.name}</h4>
            <p className="text-xs text-slate-400">View Profile</p>
          </div>

        </div>

        {/* Dark Mode */}

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        {/* Logout */}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <LogOut size={18} />
          Logout
        </button>

      </div>

    </aside>

    {/* Main Content */}

    <main className="flex-1 ml-72 p-10 min-h-screen overflow-y-auto transition-colors duration-300">

      {activeTab === "home" && (
        <div className="space-y-10">
          <UploadView onUploadComplete={fetchReports} />
          <div className="grid lg:grid-cols-2 gap-5 mt-6">
          <AIHealthSummary reports={reports} />
          <RecentActivity reports={reports} />
        </div>
          <div className="space-y-5">
            <StatsCards reports={reports} />
            <div className="space-y-5">
            <div>
            </div>

            <AnalyticsCharts reports={reports} />
          </div>
            <DashboardView reports={reports} />
          </div>
          
        </div>
      )}

      {activeTab === "history" && (
        <HistoryView
          reports={reports}
          setSelectedReport={setSelectedReport}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "profile" && (
        <ProfileView reports={reports} />
      )}

      {activeTab === "chatbot" && (
        <ChatbotView
          reportContext={selectedReport}
          onClearContext={() => setSelectedReport(null)}
        />
      )}

    </main>

  </div>
);
}