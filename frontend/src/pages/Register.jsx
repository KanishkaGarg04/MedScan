import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Activity } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration Successful!");
      window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg backdrop-blur-xl bg-white dark:bg-slate-800/70 border border-white/50 p-8 md:p-12 rounded-[24px] shadow-2xl">
        
        {/* Logo Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Activity className="text-white" size={36} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">MedScan</h1>
            <p className="text-slate-500 dark:text-slate-300 font-medium">Report Analyzer</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
        <p className="text-slate-500 dark:text-slate-300 mb-8">Join MedScan to start analyzing your health data.</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="Full Name"
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none"
            placeholder="Email Address"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 focus:ring-2 focus:ring-teal-500 outline-none"
              placeholder="Password"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-600 pt-2">
            <input type="checkbox" className="mt-1 accent-teal-600" required />
            I agree to the MedScan Terms of Service and Privacy Policy.
          </label>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-bold hover:opacity-90 transition-all shadow-lg shadow-blue-500/20"
          >
            Register Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-bold hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}