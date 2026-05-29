import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, 
  Clock, 
  User, 
  Bot, 
  LogOut 
} from 'lucide-react';

import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import HistoryView from './components/HistoryView';
import ChatbotView from './components/ChatbotView';
import ProfileView from './components/ProfileView';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [reports, setReports] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Fetch real database logs from your backend setup
  const fetchReports = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reports/history');
      setReports(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed fetching database history collection records:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Pre-Dashboard Login Gate Entry Frame matching design colors
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] antialiased font-sans">
        <div className="text-center max-w-md w-full px-8 py-10 bg-white border border-slate-100 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.015)]">
          <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/10 mb-6">
            <svg className="w-7 h-7 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">MedScan</h2>
          <p className="text-base text-slate-400 font-normal mb-8 leading-relaxed">
            Upload your medical reports and get instant AI-powered health insights
          </p>
          <button 
            onClick={() => setIsLoggedIn(true)}
            className="w-full bg-gradient-to-r from-teal-500 to-blue-600 text-white px-6 py-4 rounded-xl text-base font-semibold shadow-md shadow-blue-500/10 hover:opacity-95 transition-all active:scale-[0.99]"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f7fafd] text-slate-700 font-sans antialiased tracking-tight">
      
      {/* ================= FIXED SIDEBAR NAV PANEL (MEDIUM SIZE W-72) ================= */}
      <aside className="w-72 bg-white border-r border-slate-100 h-screen fixed flex flex-col justify-between p-6 z-30 shrink-0">
        
        <div className="space-y-8">
          {/* Aesthetic Brand Logo Header Frame */}
          <div className="flex items-center gap-3.5 px-2 py-1">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10 shrink-0">
              {/* Thin Line ECG / Pulse Icon exactly matching image concept */}
              <svg className="w-6 h-6 stroke-white fill-none" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">MedScan</h1>
              <p className="text-xs font-semibold text-slate-400 mt-0.5 tracking-wide">Report Analyzer</p>
            </div>
          </div>

          {/* Navigation Matrix — Reconstructed layout with image colors */}
          <nav className="space-y-1.5">
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'chatbot', label: 'AI Consultant', icon: Bot },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-400 hover:text-slate-800 hover:bg-slate-50/80'
                  }`}
                >
                  <Icon 
                    size={20} 
                    strokeWidth={isActive ? 2.5 : 2} 
                    className={isActive ? 'text-white' : 'text-slate-400'} 
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer section */}
        <div className="space-y-4 border-t border-slate-100 pt-5">
          <div className="flex items-center gap-3.5 px-2">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 border border-slate-200/60 flex items-center justify-center font-bold text-base tracking-tight shrink-0">
              KN
            </div>
            <div className="space-y-0.5 truncate">
              <h4 className="text-[14.5px] font-bold text-slate-800 leading-none truncate">Rakhi Soni</h4>
              <p className="text-xs font-semibold text-slate-400 mt-0.5">Patient Profile</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[13px] text-slate-400 hover:text-rose-600 hover:bg-rose-50/40 transition-all tracking-normal"
          >
            <LogOut size={16} strokeWidth={2.2} />
            <span>Logout Account</span>
          </button>
        </div>

      </aside>

      {/* ================= MAIN CONTENT VIEWPORT CONTAINER ================= */}
      <main className="flex-1 ml-72 p-10 min-h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Dashboard Route View layout */}
          {activeTab === 'home' && (
            <div className="space-y-10">
              
              {/* Dynamic File Uploader Container Subview */}
              <UploadView onUploadComplete={fetchReports} />
              
              {/* Reports Dashboard Grid View */}
              <DashboardView reports={reports} />
            </div>
          )}
          
          {/* Alternate Navigation Tab Panels */}
          {activeTab === 'history' && <HistoryView reports={reports} />}
          {activeTab === 'profile' && <ProfileView reports={reports} />}
          {activeTab === 'chatbot' && <ChatbotView />}

        </div>
      </main>
      
    </div>
  );
}