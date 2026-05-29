import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ShieldCheck, FileBarChart, CalendarDays } from 'lucide-react';

export default function ProfileView({ reports = [] }) {
  const analyzedCount = reports.length;

  // Local configuration states for onboarding/credentials
  const [profileData, setProfileData] = useState({
    name: 'Rakhi Soni',
    password: '••••••••••••'
  });
  const [isSetupCompleted, setIsSetupCompleted] = useState(true); // Default matching your initial screen state
  const [showPassword, setShowPassword] = useState(false);
  
  // Temporary form buffer states
  const [inputName, setInputName] = useState('');
  const [inputPassword, setInputPassword] = useState('');

  // Handle setting up custom credential pairs
  const handleProfileSetup = (e) => {
    e.preventDefault();
    if (!inputName.trim() || !inputPassword.trim()) return;

    setProfileData({
      name: inputName.trim(),
      password: inputPassword
    });
    setIsSetupCompleted(true);
  };

  // Helper calculation to pull name abbreviation initials dynamically
  const getInitials = (fullName) => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  /* ================= CONFIGURATION PROFILE LOGIN / SETUP FORM VIEW ================= */
  if (!isSetupCompleted) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.015)] space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white mx-auto shadow-md shadow-blue-500/10">
            <User size={22} strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Profile Credentials</h2>
          <p className="text-sm text-slate-400 font-medium">Configure account details to update clinical dashboard data logs</p>
        </div>

        <form onSubmit={handleProfileSetup} className="space-y-4 pt-2">
          {/* Patient Profile Name Input Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Patient Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                required
                placeholder="e.g., Kanishka"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Secure Cryptographic Passcode Input Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Account Security Key</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter password access code"
                value={inputPassword}
                onChange={(e) => setInputPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Core Configuration Submit Execution Vector */}
          <button
            type="submit"
            className="w-full mt-2 bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3.5 rounded-xl text-[15px] font-bold shadow-md shadow-blue-500/10 hover:opacity-95 transition-all active:scale-[0.99]"
          >
            Save & Load Profile Account
          </button>
        </form>
      </div>
    );
  }

  /* ================= ACTIVE PROFILE COMPONENT VIEW PORT PANEL ================= */
  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-8">
      
      {/* Visual Identity Profile Frame Block */}
      <div className="flex flex-col items-center pb-6 border-b border-slate-100">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-black text-3xl flex items-center justify-center shadow-md shadow-blue-500/10 mb-4 uppercase tracking-wider select-none">
          {getInitials(profileData.name)}
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{profileData.name}</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 flex items-center gap-1">
          <ShieldCheck size={14} className="text-emerald-500" /> Secure Clinical Node Account
        </p>
      </div>

      {/* Profile Parameters Matrix Stack */}
      <div className="space-y-4 text-[14px] font-semibold text-slate-600">
        
        {/* Dynamic Parameter Name Display Row */}
        <div className="flex justify-between items-center py-3 border-b border-slate-50">
          <div className="flex items-center gap-2.5 text-slate-400">
            <User size={18} className="shrink-0" />
            <span>Configured Name</span>
          </div>
          <span className="font-bold text-slate-900">{profileData.name}</span>
        </div>

        {/* Dynamic Masked Passcode Parameter Row */}
        <div className="flex justify-between items-center py-3 border-b border-slate-50">
          <div className="flex items-center gap-2.5 text-slate-400">
            <Lock size={18} className="shrink-0" />
            <span>Node Password Protection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-800 tracking-wide">
              {showPassword ? profileData.password : '••••••••••••'}
            </span>
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Total Database Dossier Extraction Logs Count */}
        <div className="flex justify-between items-center py-3 border-b border-slate-50">
          <div className="flex items-center gap-2.5 text-slate-400">
            <FileBarChart size={18} className="shrink-0" />
            <span>Total Reports Analyzed</span>
          </div>
          <span className="font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 text-xs">
            {analyzedCount} dossiers
          </span>
        </div>

        {/* System Timeline Core Meta Enrollment Date */}
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-2.5 text-slate-400">
            <CalendarDays size={18} className="shrink-0" />
            <span>System Enrollment State</span>
          </div>
          <span className="font-bold text-slate-900">May 2026</span>
        </div>

      </div>

      {/* Secondary Quick Action Interface Toggle Trigger */}
      <div className="pt-2">
        <button
          onClick={() => {
            setInputName(profileData.name === 'Rakhi Soni' ? '' : profileData.name);
            setInputPassword(profileData.password === '••••••••••••' ? '' : profileData.password);
            setIsSetupCompleted(false);
          }}
          className="w-full bg-slate-50 hover:bg-slate-100/80 text-slate-500 hover:text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-colors border border-slate-200/40 uppercase tracking-wider"
        >
          Reconfigure Verification Credentials
        </button>
      </div>

    </div>
  );
}